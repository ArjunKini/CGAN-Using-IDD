$(document).ready(function () {
    var $o, os;
    var toolSelect;
    var imageUrl = [
        "static/image/335421_gtFine_labelColors.png",
        "{{ url_for('static', filename='image/267906_gtFine_labelColors.png') }}",
        "{{ url_for('static', filename='image/506316_gtFine_labelColors.png') }}",
        "{{ url_for('static', filename='image/394470_gtFine_labelColors.png') }}",
        "{{ url_for('static', filename='image/405836_gtFine_labelColors.png') }}"
    ];
    var xss = Math.floor((Math.random() * 5)+ 0);
    console.log(xss);
    $('.canvas').css('background-image', 'url(' + imageUrl[xss] + ')');

    $('#myTabs a').click(function (e) {
        e.preventDefault();
        $(this).tab('show');
        console.log(this.id);
        if(this.id === "auto-tab")
            toolSelect = tools;
        if(this.id === "bike-tab")
            toolSelect = tools2;
        if(this.id === "car-tab")
            toolSelect = tools3;
        if(this.id === "person-tab")
            toolSelect = tools4;
        if(this.id === "tree-tab")
            toolSelect = tools5;
        toolbarSec();
    });
    var $toolbar = $(".toolbar");
    function toolbarSec() {
        //generate toolbar

        $(".toolbar").html("");
        $.each(toolSelect, function (i, tool) {
            $("<img>", tool).appendTo($toolbar);
        });
        var $tool = $toolbar.find("img");

        //define drag and drop handlers

        $(".canvas").on({
            // dragenter: false,
            // dragover: false,
           //drop: onClick
        });
    }
    $("img.resizable").mousedown(function(event){
        if(event.button == 2){
            $(this).remove();
        }
        console.log(this);
        switch (event.which) {
            case 1:
                alert('Left mouse button is pressed');
                break;
            case 2:
                alert('Middle mouse button is pressed');
                break;
            case 3:
                alert('Right mouse button is pressed');
                break;
            default:
                alert('Nothing');
        }
    });

    $toolbar.on("click", "img", onClick);
    //handle commencement of drag
   function onClick(e) {
        // $(this).className += "resize-drag"
        $o = 0;
        $o = $(this).clone();
        $o.attr("crossOrigin","null");
        $o.addClass("resizable");
        $(".canvas").append($o);
        //$o.addClass("drag-drop");

    };

    interact('.resizable')
      .draggable({
        onmove: window.dragMoveListener,
            modifiers: [
              interact.modifiers.restrict({
                restriction: 'parent',
                elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
              })
            ]
      })
      .resizable({
        preserveAspectRatio: false,
        edges: {
          left: false,
          right: true,
          bottom: true,
          top: false
        }
      })
      .actionChecker(function (pointer, event, action, interactable) {
            interactable.options.resize.preserveAspectRatio = event.shiftKey;
            return action;
        })
      .on('dragstart', function (event) {
        event.preventDefault();
      })
      .on('dragmove', dragMoveListener)
      .on('resizestart', function(event) {
        //console.info('resizestart = ', event);
      })
      .on('dblclick', function(event){
           // if(event.button == 2)
            event.target.remove();
            // console.log(this);
        })
      .on('resizemove', function(event) {
        //console.info('resizemove = ', event);
        var target = event.target;
        target.style.width  = event.rect.width + 'px';
      });


    function dragMoveListener(event) {
      var target = event.target,
        // keep the dragged position in the data-x/data-y attributes
        x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
        y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

      // translate the element
      target.style.webkitTransform =
        target.style.transform =
        'translate(' + x + 'px, ' + y + 'px)';

      // update the posiion attributes
      target.setAttribute('data-x', x);
      target.setAttribute('data-y', y);
    }

    //};
});

//define toolset (JSON, e.g. from database)...
var tools = [{
    "data-id": 1,
    alt: "Straight",
    title: "Straight",
    width: "80",
    src: "static/image/clips/Auto/a1.png",
    "data-description": "Straight in photo"
}, {
    "data-id": 2,
    alt: "snow",
    title: "snow",
    width: "80",
    src: "image/clips/Auto/a2.png",
    "data-description": "snow in photo"
}, {
    "data-id": 3,
    alt: "straight far",
    title: "straight far",
    width: "80",
    src: "image/clips/Auto/a3.png",
    "data-description": "straight far in photo"
}, {
    "data-id": 4,
    alt: "Bigger auto",
    title: "Bigger auto",
    width: "80",
    src: "image/clips/Auto/a4.png",
    "data-description": "Bigger auto in photo"
}, {
    "data-id": 5,
    alt: "rain",
    title: "rain",
    width: "80",
    src: "image/clips/Auto/a5.png",
    "data-description": "rain in photo"
}];

//define toolset (JSON, e.g. from database)...
var tools2 = [{
    "data-id": 1,
    alt: "Straight",
    title: "Straight",
    width: "80",
    src: "image/clips/Bike/b1.png",
    "data-description": "Straight in photo"
}, {
    "data-id": 2,
    alt: "snow",
    title: "snow",
    width: "80",
    src: "image/clips/Bike/b2.png",
    "data-description": "snow in photo"
}, {
    "data-id": 3,
    alt: "straight far",
    title: "straight far",
    width: "80",
    src: "image/clips/Bike/b3.png",
    "data-description": "straight far in photo"
}, {
    "data-id": 4,
    alt: "Bigger auto",
    title: "Bigger auto",
    width: "80",
    src: "image/clips/Bike/b4.png",
    "data-description": "Bigger auto in photo"
}, {
    "data-id": 5,
    alt: "rain",
    title: "rain",
    width: "80",
    src: "image/clips/Bike/b5.png",
    "data-description": "rain in photo"
}];

//define toolset (JSON, e.g. from database)...
var tools3 = [{
    "data-id": 1,
    alt: "Straight",
    title: "Straight",
    width: "80",
    src: "image/clips/Car/c1.png",
    "data-description": "Straight in photo"
}, {
    "data-id": 2,
    alt: "snow",
    title: "snow",
    width: "80",
    src: "image/clips/Car/c2.png",
    "data-description": "snow in photo"
}, {
    "data-id": 3,
    alt: "straight far",
    title: "straight far",
    width: "80",
    src: "image/clips/Car/c3.png",
    "data-description": "straight far in photo"
}, {
    "data-id": 4,
    alt: "Bigger auto",
    title: "Bigger auto",
    width: "80",
    src: "image/clips/Car/c4.png",
    "data-description": "Bigger auto in photo"
}, {
    "data-id": 5,
    alt: "rain",
    title: "rain",
    width: "80",
    src: "image/clips/Car/c5.png",
    "data-description": "rain in photo"
}];

//define toolset (JSON, e.g. from database)...
var tools4 = [{
    "data-id": 1,
    alt: "Straight",
    title: "Straight",
    width: "80",
    src: "image/clips/Person/p1.png",
    "data-description": "Straight in photo"
}, {
    "data-id": 2,
    alt: "snow",
    title: "snow",
    width: "60",
    src: "image/clips/Person/p2.png",
    "data-description": "snow in photo"
}, {
    "data-id": 3,
    alt: "straight far",
    title: "straight far",
    width: "80",
    src: "image/clips/Person/p3.png",
    "data-description": "straight far in photo"
}, {
    "data-id": 4,
    alt: "Bigger auto",
    title: "Bigger auto",
    width: "80",
    src: "image/clips/Person/p4.png",
    "data-description": "Bigger auto in photo"
}, {
    "data-id": 5,
    alt: "rain",
    title: "rain",
    width: "80",
    src: "image/clips/Person/p5.png",
    "data-description": "rain in photo"
}];

//define toolset (JSON, e.g. from database)...
var tools5 = [{
    "data-id": 1,
    alt: "Straight",
    title: "Straight",
    width: "80",
    src: "image/clips/Tree/t1.png",
    "data-description": "Straight in photo"
}, {
    "data-id": 2,
    alt: "snow",
    title: "snow",
    width: "80",
    src: "image/clips/Tree/t2.png",
    "data-description": "snow in photo"
}, {
    "data-id": 3,
    alt: "straight far",
    title: "straight far",
    width: "80",
    src: "image/clips/Tree/t3.png",
    "data-description": "straight far in photo"
}, {
    "data-id": 4,
    alt: "Bigger auto",
    title: "Bigger auto",
    width: "80",
    src: "image/clips/Tree/t4.png",
    "data-description": "Bigger auto in photo"
}, {
    "data-id": 5,
    alt: "rain",
    title: "rain",
    width: "80",
    src: "image/clips/Tree/t5.png",
    "data-description": "rain in photo"
}];


// $("body").children().each(function () {
//                     $(this).html( $(this).html().replace(/"image"/g,"static/image") );
//                 });