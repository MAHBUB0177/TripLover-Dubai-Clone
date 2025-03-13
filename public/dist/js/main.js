$('#passengerBlock').on({
	"click":function(e){
      e.stopPropagation();
    }
});


$("#flight-panal").addClass("bottom-border");
        
$("#flight-panal").click(function(){
$("#flight-panal").addClass("bottom-border");
$("#hotel-panal").removeClass("bottom-border");
$("#car-panal").removeClass("bottom-border");
});

        $("#hotel-panal").click(function(){
          $("#hotel-panal").addClass("bottom-border");
          $("#flight-panal").removeClass("bottom-border");
          $("#car-panal").removeClass("bottom-border");
        });

        $("#car-panal").click(function(){
          $("#car-panal").addClass("bottom-border");
          $("#flight-panal").removeClass("bottom-border");
          $("#hotel-panal").removeClass("bottom-border");
        });
