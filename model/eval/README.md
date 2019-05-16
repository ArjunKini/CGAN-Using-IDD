## Evaluating the trained model

Download the IDD dataset and upload the files in the same directory format to Google Drive
preferably by creating a new Google Account

Upload the Notebooks to the same Drive and open it in Colab

Upload the saved generator checkpoint to the same Drive.

Change Runtime type to GPU in Python3 and run the notebooks as follows:
1) GenerateFakes
2) Evaluation

### Evaluation method
The error rate is assumed to be the average number of pixels misclassified on the generated image by an already trained segmentation network [LightWeight RefineNet](https://github.com/DrSleep/light-weight-refinenet) when compared to the segmentation by the same network on the equivalent real image. 
