// JavaScript Document

var InterfaceMaster = (function () {
    var instance;

    function createInstance() {


        var object = new interfaceObject();

		function interfaceObject(){

			this.init = function(){
			};

			// Given a name, save current list to a cookie
			$(".save.button").click(function(e){
				var ads = $(".check.ads").hasClass("on") ? 1 : 0;

				$.ajax({

					url : host+'ajax/settingscookie.php',
					type : 'POST',
					data : {
						'lang': 'en',
						'ads': ads
					},
					dataType:'json',
					success : function(data) {
						ModalWindow($(".settings-save-message"));
					},
					error : function(request,error)
					{
						console.log("Request: "+JSON.stringify(request));
						console.log(error);
					}
				});
			});

		};

        return object;
    }

    return {
        getInstance: function () {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
})();
