from flask import Flask, redirect, Markup, render_template, flash, request, session, abort, redirect, url_for
from random import randint
import base64
from flask_cors import CORS

#***************************************#
import time
import os, glob
import time
import torch
import torch.nn as nn
import os
from PIL import Image
import numpy as np
import glob
from random import randint, shuffle
from io import BytesIO
from torch.autograd import Variable
import torchvision.transforms as transforms


def resize_image(im,bandwidth=256):

    img = im.resize((bandwidth, bandwidth),  Image.ANTIALIAS)
    img=np.array(img)/255*2-1
    img=img[:,:,:3]
    img = np.moveaxis(img, 2, 0)
    return img

class UBlock(nn.Module):

    def __init__(self, s, nf_in, max_nf, use_batchnorm=True, nf_out=None, nf_next=None):
        super(UBlock, self).__init__()
        #print("Initializing ublock- size of s =", s)
        assert s>=2 and s%2==0
        nf_next = nf_next if nf_next else min(nf_in*2, max_nf)
        nf_out = nf_out if nf_out else nf_in
        self.conv = nn.Conv2d(nf_in, nf_next, 4, 2, 1, bias=not (use_batchnorm and s>2) )
        if s>2:
            next_block = [nn.BatchNorm2d(nf_next)] if use_batchnorm else []
            next_block += [nn.LeakyReLU(0.2, inplace=True), UBlock(s//2, nf_next, max_nf)]
            self.next_block = nn.Sequential(*next_block)
        else:
            self.next_block = None
        convt = [nn.ReLU(),
                 nn.ConvTranspose2d(nf_next*2 if self.next_block else nf_next, nf_out,
                                        kernel_size=4, stride=2,padding=1, bias=not use_batchnorm)]
        if use_batchnorm:
            convt += [nn.BatchNorm2d(nf_out)]
        if s <= 8:
            convt += [nn.Dropout(0.5, inplace=True)]
        self.convt = nn.Sequential(*convt)

    def forward(self, x):
        x = self.conv(x)
        if self.next_block:

            x2 = self.next_block(x)
            x = torch.cat((x,x2),1)
        return self.convt(x)


def UNET_G(isize, nc_in=3, nc_out=3, ngf=64):
    #Constructs UNET architecture for generator sequentially
    return nn.Sequential(
                  UBlock(isize, nc_in, 8*ngf, False, nf_out=nc_out, nf_next=ngf),
                  nn.Tanh() )

def netG_gen(A):
    #Passes input image A to generatorand returns image B
    return netG(A)
imageSize=256
netG = UNET_G(isize=256, nc_in=3, nc_out=3, ngf=64)
device = torch.device('cpu')

#replace with your path
path_to_generator_file=r"Generator.pt"
if os.path.exists(path_to_generator_file):
  netG=torch.load(path_to_generator_file, map_location=device).double()


path_to_input_img="static/image/pred.png"
path_to_output_img="static/image/"
output_width=512
output_height=288

#***************************************#

app = Flask(__name__)
CORS(app)
app.config['SECRET_KEY'] = 'afa376da4c6247cfd931a30ce3d579d6'

data = None

@app.route("/img", methods=["GET", "POST"])
def img():
	#creating dynamic output image path
	path_to_output_img = "static/image/"
	numbb = "s"
	vrand = randint(1,999)
	while os.path.exists("static/image/display"+str(vrand)+".png"):
		vrand = randint(1,999)
	print (vrand)
	path_to_output_img += "display"+str(vrand)+".png"

	#changing base64 to png
	ref= request.form
	for key in ref.keys():
		data = key
	data = data + "=" * (-1+(4 - len(data) % 4) % 4)
	data = data.replace("data:image/octet-stream;base64,","")
	data = data.replace(" ","+")
	data = data.encode();
	with open("static/image/pred.png", "wb") as fh:
		fh.write(base64.b64decode(data))

	#passing th image to model and saving processed image
	image = Image.open(path_to_input_img,'r')
	image=resize_image(image)

	image=np.expand_dims(image, axis=0)

    #making input into pytorch variable
	image=Variable(torch.from_numpy(image))
    #getting output from network
	output= netG_gen(image).detach().numpy()
    #manipulating output image
	int_X = ( (output+1)/2*255).clip(0,255).astype('uint8')
	int_X = np.moveaxis(int_X.reshape(-1,3,imageSize,imageSize), 1, 3)
	int_X = int_X.reshape(-1, imageSize, imageSize,3).reshape(imageSize,-1, 3)

	response=Image.fromarray(int_X).resize((output_width,output_height),Image.ANTIALIAS)
	response.save(path_to_output_img)

	#returning output image path to ajax
	return path_to_output_img

@app.route("/clear")
def clear():
	#clearing all the files starting with
	for filename in glob.glob("static/image/display*"):
		os.remove(filename)
	return redirect(url_for('index'))

@app.route("/")
def index():
	#home screen
	return render_template('index.html')

@app.after_request
def after_request(response):
  response.headers.add('Access-Control-Allow-Origin', '*')
  response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  return response


if __name__ == "__main__":
    app.run(debug = True)