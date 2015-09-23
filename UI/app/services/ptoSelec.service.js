angular.module('IETFEM')
.factory('PtoSelecService', ['leftMenuService',function(leftMenuService){
  		var puntoSeleccionado={
			  id:0,
			  sceneId:0,
			  xCondicion:0,
			  yCondicion:0,
			  zCondicion:0,
			  xForce:0,
			  yForce:0,
			  zForce:0,
			  coords: {
					x: 0,
					y: 0,
					z: 0
				}
		  };

		var puntoReal;
		var infoPuntoForm;// Es el formulario, para poder resetearlo
    	return {
    		getPuntoReal: function() {
            	return puntoReal;
       		},
        	getPunto: function() {
            	return puntoSeleccionado;
       		},
			setPunto: function(value,ptoReal) {
				puntoReal=value;

				puntoSeleccionado.id=value.id;
				puntoSeleccionado.sceneId=value.sceneId;
				puntoSeleccionado.xCondicion=value.xCondicion;
				puntoSeleccionado.yCondicion=value.yCondicion;
				puntoSeleccionado.zCondicion=value.zCondicion;
				puntoSeleccionado.xForce=value.xForce;
				puntoSeleccionado.yForce=value.yForce;
				puntoSeleccionado.zForce=value.zForce;
				puntoSeleccionado.coords=value.coords;

				leftMenuService.setLastSelected("NODO");
			},
			setInfoPuntoForm: function(f){
				infoPuntoForm=f;
			},
			resetPuntoSeleccionado: function(){
				puntoSeleccionado.id=0;
				puntoSeleccionado.sceneId=0;
				puntoSeleccionado.xCondicion=0;
				puntoSeleccionado.yCondicion=0;
				puntoSeleccionado.zCondicion=0;
				puntoSeleccionado.xForce=0;
				puntoSeleccionado.yForce=0;
				puntoSeleccionado.zForce=0;
				puntoSeleccionado.coords={
											x: 0,
											y: 0,
											z: 0
										};
			},
			resetForm: function(){
				if(typeof infoPuntoForm != 'undefined'){
				    infoPuntoForm.$setPristine();    
			   }
			}
		}
	}]);