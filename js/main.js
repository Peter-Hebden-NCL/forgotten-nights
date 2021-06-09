//displaying warning for mobile users
if( navigator.userAgent.match(/Android/i)
|| navigator.userAgent.match(/webOS/i)
|| navigator.userAgent.match(/iPhone/i)
|| navigator.userAgent.match(/iPad/i)
|| navigator.userAgent.match(/iPod/i)
|| navigator.userAgent.match(/BlackBerry/i)
|| navigator.userAgent.match(/Windows Phone/i) ) {
$(".info-main, #close-button").css({"display":"none"});
$(".info-mobile").css({"display":"block"});
}

window.stars_total = 0;

//initial setup
window.onload = () => {
    'use strict';

    //setting initial conditions - empty sky 
    window.dummy_list = []; //array listing stars and empty spaces
    window.audio_list = []; //array of audio files to play
    
    new_sky();

    //clearing sky to start with empty screen
    $(".item").each(function(){
      if ( $(this).html() == "star" ) {
        $(this).html("add");
        $(this).addClass("invis");
      }
    });

    list_create();
};


// FUNCTION TO REFRESH THE WINDOW WITH A NEW RANDOMLY GENERATED VIEW OF THE SKY

window.new_sky = function() {
  window.stars_total = 0;
  const threshold = Math.random();
    console.log(threshold);
    const items_total = 400;
    var i;
    var icon;
    var x_align;
    var y_align;
    
    //adding moon button
    $(".parent").html('<div id="moon" class="title-container" draggable="true"><a id="title-click" href="#"><span class="material-icons title">brightness_3</span></a></div>');

    //determining each star position/size and adding to grid
    for (i=1; i<=items_total; i++) {
      var star_ran = Math.random();
      var x_align = ((Math.random()*5)-2).toString()+"em";
      var y_align = ((Math.random()*5)-2).toString()+"em";
      var star_size = ((Math.random()*0.4)+0.3).toString()+"em";
      var add_size = "0.6em"
      if (star_ran < threshold) {
        icon = "star";
      } else {
        icon = "add";
      }

      if (icon == "star") {
        $(".parent").append("<div style='visibility:hidden; font-size:"+star_size+"; left:"+x_align+"; top:"+y_align+"' class='material-icons item i-"+i+"'>"+icon+"</div>");
      } else {
        $(".parent").append("<div style='font-size:"+add_size+"; left:"+x_align+"; top:"+y_align+"' class='material-icons item invis i-"+i+"'>"+icon+"</div>");
      }
    }

    //preventing overlap with moon button
    $(".item").each(function(){
      if (
          $(this).position().top+$(this).height() >= $(".title-container").position().top-5
          &&
          $(this).position().top <= $(".title-container").position().top+$(".title-container").height()+5
          &&
          $(this).position().left <= $(".title-container").position().left+$(".title-container").width()+5
          &&
          $(this).position().left+$(this).width() >= $(".title-container").position().left-5
      ) {
          $(this).css({"visibility":"hidden"});    
      } else {
          $(this).css({"visibility":"visible"}); 
      }
    })
};



//FUNCTION FOR CREATING THE ARRAY OF AUDIO FILES TO PLAY

window.list_create = function() {
  window.audio_list = [];
  window.dummy_list = [];
  console.log("audio_list empty");

  $(".item").each(function(){
    if ($(this).html() == "star") {
      window.dummy_list.push(1);
    } else {
      window.dummy_list.push(0);
    }
  });
  window.stars_total = 0;
  for (s in window.dummy_list) {
    window.stars_total = window.stars_total + window.dummy_list[s];
  }

  audio_list = poem_constructor();

  console.log("audio_list repopulated");
  console.log(window.dummy_list);
  console.log(window.stars_total);
};


// FUNCTION TO STOP ALL AUDIO PLAYING

window.stop_all = function() {
  for (a in audio_list) {
    audio_list[a].pause();
    audio_list[a].currentTime = 0;
  }
  $("#stop-button").css({"visibility":"hidden"});
}


// FUNCTION TO CONSTRUCT THE CORRECT VERSION OF THE POEM BASED ON THE SKY

window.poem_constructor = function() {
  console.log("POEM CONSTRUCTOR");

  // gathering some information about the sky

  //using the dummy_list array index of each star to create a ID number for the sky, plus other 'stats' generating lines
  index_total = 0;
  upper_seg = 0; // number of stars in top half of sky
  lower_seg = 0; // ... and lower half

  for (d in dummy_list) {
    if (dummy_list[d] == 1) {
      index_total = index_total + parseInt(d)+1;

      if (parseInt(d) < 200) {
        upper_seg = upper_seg +1;
      } else {
        lower_seg = lower_seg +1;
      }
    }
  }

  //determining 'main verse' in first part of poem
  if (window.stars_total == 0) {
    return [empty[1]]; // for empty sky
  }
  else if (window.stars_total < 200) {
    main_verse = index_total%5; // for few stars
  } else {
    main_verse = (index_total%5) + 5; // for many stars
  }




//returning the correct audio as an array
return    [
          lines[0][main_verse][(window.stars_total%3)][1],
          lines[1][main_verse][0][1],
          lines[1][(Math.floor(window.stars_total/40))][1][1],
          lines[1][main_verse][2][1],
          lines[lines.length-1][0][1], // Pause 1
          lines[2][Math.floor(window.stars_total/100)][1],
          lines[3][window.stars_total%4][1],
          lines[4][upper_seg%4][1],
          lines[5][index_total%3][1], 
          lines[6][Math.floor(lower_seg/40)][1],
          lines[7][index_total%5][1],
          lines[8][Math.floor(upper_seg/50)][1],
          lines[9][window.stars_total%2][1],
          lines[10][main_verse%3][1],
          lines[lines.length-1][1][1], // Pause 2
          lines[11][window.stars_total%3][1],
          lines[12][index_total%2][1],
          lines[13][index_total%3][1]
          ];

};


// STAR CLICK EVENT

$(document).on("click",".item",function(){
  console.log("*");
  if ($(this).html() == "star") {
    $(this).html("add");
    $(this).addClass("invis");
  } else {
    $(this).html("star");
    $(this).removeClass("invis");
  }
});


// MOON PLAY/PAUSE ETC EVENTS

$(document).on("mouseenter",".title",function(){
  $(this).html("play_arrow");
});

$(document).on("mouseleave",".title",function(){
  $(this).html("brightness_3");
});

$(document).on("click","#title-click",function(){
  stop_all();

  window.list_create();

  $("#stop-button").css({"visibility":"visible"});
  
  if (audio_list.length == 1) {
    console.log("empty!");
    audio_list[0].addEventListener("ended", function(){
      console.log("stop button gone!");
      $("#stop-button").css({"visibility":"hidden"});
    })
  }

  for (let i = 0; i < (audio_list.length-1); i++) {
    audio_list[i].addEventListener("ended", function(){
      console.log("-> " + (i+1));
      audio_list[i+1].play();
    });
    if (i == audio_list.length-2) {
      audio_list[i].addEventListener("ended", function(){
        $("#stop-button").css({"visibility":"hidden"});
      })
    }
  }

  audio_list[0].play(); 

});


//TOOLBAR AND WINDOW BUTTON EVENTS

$("#info-button").click(function(){
  $(".overlay").css({"display":"block"});
});

$("#close-button").click(function(){
  $(".overlay").css({"display":"none"});
});

$("#reveal-button").mousedown(function(){
  console.log("mouse down");
  $(".invis").each(function(){
    $(this).addClass("fake-hover");
  })
});
$("#reveal-button").mouseleave(function(){
  console.log("mouse up");
  $(".invis").each(function(){
    $(this).removeClass("fake-hover");
  })
});
$("#reveal-button").mouseup(function(){
  console.log("mouse up");
  $(".invis").each(function(){
    $(this).removeClass("fake-hover");
  })
});

$("#new-sky-button").click(function(){
  window.stop_all();
  window.new_sky();
  window.list_create();
});

$("#stop-button").click(function(){
  window.stop_all();
});
