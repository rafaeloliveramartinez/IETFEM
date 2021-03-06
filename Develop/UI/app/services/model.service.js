angular.module('IETFEM')
.factory('ModelService',['DefaultsService', 'SpaceService',function(DefaultsService, SpaceService) {

	// Funciones internas

	//Genera un nuevo identificador
	var newPointIdentifier = function(model) {
		var id = 0;
		for (var i = 0; i < model.points.length; i++){
			if (model.points[i].id > id)
				id = model.points[i].id
		}
		return id+1;
	};

	var newLineIdentifier = function(model) {
		var id = 0;
		for (var i = 0; i < model.lines.length; i++){
			if (model.lines[i].id > id)
				id = model.lines[i].id
		}					
		return id+1;
	};

	var newMaterialIdentifier = function(model) {
		var id = 0;
		for (var i = 0; i < model.materiales.length; i++){
			if (model.materiales[i].id > id)
				id = model.materiales[i].id
		}					
		return id+1;
	};

	var newSectionIdentifier = function(model) {
		var id = 0;
		for (var i = 0; i < model.secciones.length; i++){
			if (model.secciones[i].id > id)
				id = model.secciones[i].id
		}					
		return id+1;
	};
	
	//Obtiene un punto del modelo dadas sus coordenadas
	var getPointIdByCoords = function(x,y,z,model) {
		var id = 0;
		for (var i = 0; i < model.points.length ;i++){
			if (model.points[i].coords.x == x && model.points[i].coords.y == y && model.points[i].coords.z == z)
				id = model.points[i].id;
		};
		return id;
	};
	//--- Fin internas

	//Obtener punto del modelo por id
	var getPointById = function(id, model) {
			for (var i = 0; i < model.points.length ;i++){
				if (model.points[i].id==id){
					return model.points[i];
				}
			};
	};

	//Obtener linea del modelo por id
	var getLineById = function(id, model) {
			for (var i = 0; i < model.lines.length ;i++){
				if (model.lines[i].id==id){
					return model.lines[i];
				}
			};
	};
	//Obtener punto del modelo por id de escena
	var getPointBySceneId = function(id, model) {
			for (var i = 0; i < model.points.length ;i++){
				if (model.points[i].sceneId==id){
					return model.points[i];
				}
			};
	};

	//Obtener linea del modelo por id de escena
	var getLineBySceneId = function(id, model) {
			for (var i = 0; i < model.lines.length ;i++){
				if (model.lines[i].sceneId==id){
					return model.lines[i];
				}
			};
	};
	
	//Agrega un punto al modelo
	var addPointToModel = function(pX,pY,pZ, sceneId, model) {
			
		var point = {};
		point.id = newPointIdentifier( model);
		point.sceneId = sceneId;
		//Displacement conditions
		point.xCondicion='F';
		point.yCondicion='F';
		point.zCondicion='F';
		//Forces applied
		point.xForce=0;
		point.yForce=0;
		point.zForce=0;

		//springs
		point.xSpring=0;
		point.ySpring=0;
		point.zSpring=0;

		point.coords = {
			x: pX,
			y: pY,
			z: pZ
		};

		point.forceArrowId=0;
		point.supportXId=0;
		point.supportYId=0;
		point.supportZId=0;

		point.springXId=0;
		point.springYId=0;
		point.springZId=0;

		model.points.push(point);
	};
	
	//Agrega una línea al modelo
	var addLineToModel = function(pX1, pY1, pZ1, pX2, pY2, pZ2, lineSceneId,model) {		
		var line = {};
		line.id = newLineIdentifier(model);
		line.sceneId= lineSceneId;
		if(DefaultsService.getLineMaterial()!= null){
			line.material=DefaultsService.getLineMaterial().id;
		}
		if(DefaultsService.getLineSection()!= null){
			line.section=DefaultsService.getLineSection().id;
		}
		line.start = getPointIdByCoords(pX1, pY1, pZ1,model);
		line.end = getPointIdByCoords(pX2, pY2, pZ2, model);
		
		model.lines.push(line);
	};

	var createGridInfo = function(modelGrids){
		//Obtengo el id del nuevo grid (max+1)
		var miGridId=0;
		for (var i = 0; i < modelGrids.length ;i++){
			if(modelGrids[i].gridId >= miGridId){
				miGridId=modelGrids[i].gridId;
			}
		}
		miGridId++;

		var gridInfo={};
		gridInfo.gridId=miGridId;
		gridInfo.viewStatus=true;
		gridInfo.objects= [];

		modelGrids.push(gridInfo);
		return gridInfo;
	};

		//Agrega un punto al modelo de las grillas
	var addGridPointToModel = function(pX,pY,pZ, sceneId, gridInfo) {
		var point = {};
		point.type = "POINT"
		point.sceneId = sceneId;
		point.coords = {
			x: pX,
			y: pY,
			z: pZ
		}

		gridInfo.objects.push(point);
		
	};

	//Agrega una línea al modelo
	var addGridLineToModel = function(pX1, pY1, pZ1, pX2, pY2, pZ2, lineSceneId,gridInfo) {		
		var line = {};
		line.type = "LINE"
		line.sceneId= lineSceneId;
		line.start = {
			x: pX1,
			y: pY1,
			z: pZ1
		}
		line.end = {
			x: pX2,
			y: pY2,
			z: pZ2
		}
	
		gridInfo.objects.push(line);
	};


	var removeLineFromModel = function(lineId,model){
		var index=null;
		for (var i = 0; i < model.lines.length ;i++){
			if(model.lines[i].id== lineId){
				index=i;
				break;
			}
		}
		if(index != null){
			model.lines.splice(index,1);
		}
	};

	// Para eliminar objetos de las estructuras auxiliares x sceneId (en realidad los objetos son de la scene Three)
	var removeObjFromArray = function(sceneId,aux){
		var index=null;
		for (var i = 0; i < aux.length ;i++){
			if(aux[i].id== sceneId){
				index=i;
				break;
			}
		}
		if(index != null){
			aux.splice(index,1);
		}
	};

	var removePointFromModel = function(pointId,model){
		var index=null;
		for (var i = 0; i < model.points.length ;i++){
			if(model.points[i].id== pointId){
				index=i;
				break;
			}
		}
		if(index != null){
			model.points.splice(index,1);
		}
	};

	//Agrega un material al modelo
	var addMaterial = function(name,ym,g,a,nu,model) {		
		var material = {};
		
		material.id = newMaterialIdentifier(model)
		material.name=name;
		material.youngModule=ym;
		material.gamma=g;
		material.alpha=a;
		material.nu=nu;
		
		model.materiales.push(material);
	};

	//Agrega un material al modelo
	var addSection = function(n,s,model) {		
		var section = {};
		
		section.id= newSectionIdentifier(model);
		section.name=n;
		section.section=s;
		
		model.secciones.push(section);
	};
	
	//Verifica si un punto está en el modelo
	var isInModel = function(x,y,z, model) {
		var drawed = true;
		for (var i = 0; i < model.points.length ;i++){
			if (model.points[i].coords.x == x && model.points[i].coords.y == y && model.points[i].coords.z == z)
				return true
		};
		return false;
	};
	
	//Genera txt a partir del modelo
	var getText = function(model) {
		var text;
		var materials = [];
		var sections = [];

		text = 'Input for a 3D with large deformation (You must respect line breaks):' + '\n\n' + 'Force Magnitude' + '\n' + model.unitForce + '\n\n' + 'Length Magnitude' + '\n' + model.unitLength + '\n\n'
			   + 'Number of degrees of freedom per node' + '\n' + '3' + '\n\n' + 'Number of nodes per element' + '\n' + '2' + '\n\n';

		text +=  'Number of materials' + '\n' + model.materiales.length + '\n\n';
		
		text += 'Materials:' + '\n' + 'Young Modulus	gamma	alpha (1/C)	nu' + '\n';
		for (var i = 0; i < model.materiales.length ;i++){
			text += model.materiales[i].youngModule + '\t' + model.materiales[i].gamma + '\t' + model.materiales[i].alpha + '\t' + model.materiales[i].nu + '\n'; 
			materials[model.materiales[i].id] = i+1;
		}
		text += '\n' + 'Number of temperature cases' + '\n' + '0' + '\n\n' + 'Temperature cases:' + '\n' + 'Value' + '\n\n';
		
		text +=  'Number of sections' + '\n' + model.secciones.length + '\n\n';

		text += 'Sections:' + '\n' + 'Area' + '\n';
		for (var i = 0; i < model.secciones.length ;i++){
			text += model.secciones[i].section + '\n';
			sections[model.secciones[i].id] = i+1;
		}
		
		text += '\n' + 'Number of nodes' + '\n' + model.points.length + '\n\n';
		
		text += 'Node matrix ' + '\n';
		text += 'Xs     Ys     Zs' + '\n';
		for (var i = 0; i < model.points.length ;i++){
			text += model.points[i].coords.x + '\t' + model.points[i].coords.y + '\t' + model.points[i].coords.z + '\n'; 
		}
		text+= 	'\n' + 'Number of elements' + '\n' + model.lines.length + '\n\n';

		text += 'Conectivity matrix' + '\n';
		text += 'material     section     tempcase     start     end' + '\n';
		for (var i = 0; i < model.lines.length ;i++){
			text += materials[model.lines[i].material] + '\t' + sections[model.lines[i].section] + '\t' + 0 + '\t' + model.lines[i].start + '\t' + model.lines[i].end + '\n'; 
		}
		var displacementNodes = [];
		for (var i = 0; i < model.points.length ;i++){
			if (model.points[i].xCondicion != 'F' || model.points[i].yCondicion != 'F' || model.points[i].zCondicion != 'F'){
				displacementNodes.push(model.points[i]);
			}
		}
		text += '\n' + 'Number of displacement conditions nodes' + '\n' + displacementNodes.length + '\n\n' + 'Displacement conditions nodes matrix' + '\n' + 'Displacement node  X condition   Y condition   Z condition' + '\n'
		for (var i = 0; i < displacementNodes.length ;i++){
			text += displacementNodes[i].id + '\t' + displacementNodes[i].xCondicion + '\t' + displacementNodes[i].yCondicion + '\t' + displacementNodes[i].zCondicion + '\n'; 
		}
		
		var loadNodes = [];
		for (var i = 0; i < model.points.length ;i++){
			if (model.points[i].xForce != 0 || model.points[i].yForce != 0 || model.points[i].zForce != 0){
				loadNodes.push(model.points[i]);
			}
		}
		text += '\n' + 'Number of puntual load conditions' + '\n' + loadNodes.length + '\n\n' + 'Puntual loads conditions nodes matrix' + '\n' + 'Load node       FX            FY           FZ' + '\n'
		for (var i = 0; i < loadNodes.length ;i++){
			text += loadNodes[i].id + '\t' + loadNodes[i].xForce + '\t' + loadNodes[i].yForce + '\t' + loadNodes[i].zForce + '\n'; 
		}
		
		//Agrega las opciones de salida al final
		text += '\n' + 'Number of dead volume load conditions' + '\n' + '0' +'\n\n' + 'Dead volume loads conditions matrix' + '\n' + 'Element           bx                  by                  bz' + '\n';

		var springNodes = [];
		for (var i = 0; i < model.points.length ;i++){
			if (model.points[i].xSpring != 0 || model.points[i].ySpring != 0 || model.points[i].zSpring != 0){
				springNodes.push(model.points[i]);
			}
		}

		text += '\n' + 'Number of springs conditions nodes' + '\n' + springNodes.length + '\n\n' + 'Springs conditions nodes matrix' + '\n' + 'Spring node  X condition   Y condition   Z condition ' + '\n'
		for (var i = 0; i < springNodes.length ;i++){
			text += springNodes[i].id + '\t' + springNodes[i].xSpring + '\t' + springNodes[i].ySpring + '\t' + springNodes[i].zSpring + '\n'; 
		}

		//text +=  '\n' + 'Scale Factor' + '\n' + 'SD_Deformed   Supports    Areas    Forces    Frames    Numbers    LD_Deformed' + '\n' + '   70           1         1         1         0.05         1         70' + '\n\n' + 'What you wanna see? (Yes=1, No=0)' + '\n' + 'Indeformed   SD_Deformed   SD_Axial   LD_Deformed    LD_Axial     Convergence' + '\n' + '	1                 1            1          1             1              1' + '\n\n' + 'Of selectet plots, wich of them you wanna print in a .png image? (Yes=1, No=0)' + '\n' + '	Indeformed   SD_Deformed  SD_Axial   LD_Deformed   LD_Axial     Convergence' + '\n' + '	1                 1            1          1            1             1' + '\n\n' + 'How many images do you wanna see for small deformation?' + '\n' + 'SD_Deformed   SD_Axial  ' + '\n' + '	1               1' + '\n\n' + 'What you wanna see in plots? (Yes=1, No=0)' + '\n' + 'Supports   Node_Numbers   Elements_Numbers   Forces          Axial_Force_Value' + '\n' + '	1               0                0              1                   0' + '\n\n' + 'For 3D plots, what you wanna see? (Yes=1, No=0)' + '\n' + 'If you choose Dif_View=1 IETFEM use default AZIMUTH and ELEVATION, if you choose Dif_View=0 you must type aximuth and elevation in degrees.' + '\n' + 'XY_plane    XZ_plane    YZ_plane    Dif_View   AZIMUTH(degree)   ELEVATION(degree)   ' + '\n' + '	   1            1           1           0           150               15   ' + '\n\n' + 'Text output format (Yes=1, No=0)' + '\n' + 'TXT  TEX' + '\n' + '1     1' + '\n';

		return text;
		
	};

	var validModel = function(model) {
		var validObj = {
			valid:true,
			emptyStructure:false,
			invalidStructure:false
		};
		if (model.lines.length == 0){
			validObj.emptyStructure = true
			validObj.valid = false
		}
		for (var i = 0; i < model.lines.length ;i++){
			if(!model.lines[i].material || !model.lines[i].section) {
				validObj.invalidStructure = true;
				validObj.valid = false
			}
		}
		return validObj;
	};

	var setModelMaterial = function(scene, model, material){
		for (var i = 0; i < model.points.length ;i++){
			SpaceService.setMaterial(model.points[i].sceneId, scene, material);
		};
		for (var i = 0; i < model.lines.length ;i++){
			SpaceService.setMaterial(model.lines[i].sceneId, scene, material);
		};
	};

	var setModelOpaque = function(scene, model){
		if (model.points.length > 0){
			var material = SpaceService.getMaterial(model.points[0].sceneId, scene);
			material = new THREE.MeshBasicMaterial( {color: material.color} );
			for (var i = 0; i < model.points.length ;i++){
				SpaceService.setMaterial(model.points[i].sceneId, scene, material);
			};
			for (var i = 0; i < model.lines.length ;i++){
				SpaceService.setMaterial(model.lines[i].sceneId, scene, material);
			};
		};	
	};

	var setModelTransparent = function(scene, model){
		if (model.points.length > 0){
			var material = SpaceService.getMaterial(model.points[0].sceneId, scene);
			material = new THREE.MeshBasicMaterial( {color: material.color, transparent: true, opacity: 0.15} );
			for (var i = 0; i < model.points.length ;i++){
				SpaceService.setMaterial(model.points[i].sceneId, scene, material);
			};
			for (var i = 0; i < model.lines.length ;i++){
				SpaceService.setMaterial(model.lines[i].sceneId, scene, material);
			};
		};	
	};

	var colorizeModel = function(scene, model, deformed, type, transparent){

		var color, index, max, min;
		var maxs = {};
		var mins = {};

		max = 0;
		min = 9999;
		if (type != 'normal'){
			for (var i = 0; i < model.lines.length ;i++){
				switch(type){
					case "deformation":
						if (deformed.lines[i].deformation > max)
							max = deformed.lines[i].deformation;
						if (deformed.lines[i].deformation < min)
							min = deformed.lines[i].deformation;
						break;
					case "force":
						if (deformed.lines[i].force > max)
							max = deformed.lines[i].force;
						if (deformed.lines[i].force < min)
							min = deformed.lines[i].force;
						break;
					case "tension":
						if (deformed.lines[i].tension > max)
							max = deformed.lines[i].tension;
						if (deformed.lines[i].tension < min)
							min = deformed.lines[i].tension;
						break;		
				}			
			};
		};

		for (var i = 0; i < model.lines.length ;i++){
				switch(type){
					case "normal":
						color = 0x000000;
						break;
					case "deformation":
						index = 0;
						if (deformed.lines[i].deformation > 0){
							for (var j = 0; j <= max; j+=max/5){
								if (deformed.lines[i].deformation > j)
									index +=1
							}
						} else{
							for (var j = 0; j <= -min; j+=-min/5){
									if (-deformed.lines[i].deformation > j)
										index +=1
								}
								index = -index;
						}
						color = SpaceService.getColor(index);
						break;
					case "force":
						index = 0;
							if (deformed.lines[i].force > 0){
								for (var j = 0; j <= max; j+=max/5){
									if (deformed.lines[i].force > j)
										index +=1
								}
							} else{
								for (var j = 0; j <= -min; j+=-min/5){
									if (-deformed.lines[i].force > j)
										index +=1
								}
								index = -index;
							}
							color = SpaceService.getColor(index);
							break;
					case "tension":
						index = 0;
							if (deformed.lines[i].tension > 0){
								for (var j = 0; j <= max; j+=max/5){
									if (deformed.lines[i].tension > j)
										index +=1
								}
							} else{
								for (var j = 0; j <= -min; j+=-min/5){
									if (-deformed.lines[i].tension > j)
										index +=1
								}
								index = -index;
							}
							color = SpaceService.getColor(index);
							break;
				}
				if (transparent){
					var material = new THREE.MeshBasicMaterial( {color: color, transparent: true, opacity: 0.15} );
				} else {
					var material = new THREE.MeshBasicMaterial( {color: color} );
				}

				SpaceService.setMaterial(model.lines[i].sceneId, scene, material);
		};
	};	

	return {
		addMaterial: addMaterial,
		addSection: addSection,
		getPointById: getPointById,
		getLineById: getLineById,
		getPointBySceneId: getPointBySceneId,
		getLineBySceneId: getLineBySceneId,
		getPointIdByCoords: getPointIdByCoords,
		removeLineFromModel: removeLineFromModel,
		removeObjFromArray: removeObjFromArray,
		removePointFromModel: removePointFromModel,
		addPointToModel: addPointToModel,
		addLineToModel: addLineToModel,
		isInModel: isInModel,
		getText: getText,
		validModel: validModel,
		setModelMaterial: setModelMaterial,
		setModelTransparent: setModelTransparent,
		setModelOpaque: setModelOpaque,
		addGridLineToModel: addGridLineToModel,
		addGridPointToModel: addGridPointToModel,
		createGridInfo: createGridInfo,
		colorizeModel: colorizeModel
	};
}]);