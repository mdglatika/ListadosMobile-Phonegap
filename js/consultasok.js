//consulta.prop: {codigo, nombreTabla, nombreAMostrar, filtro[]{.nombre, tipo, filtrar:bool }, orden, ordenBy, columnaCodigo}
var _clave = "";
var _params = "";
var _url = "";
var _consultas = [];

//para que no tarde el click
window.addEventListener('load', function() {
	new FastClick(document.body);
}, false);

function actualizar(){
/*
	var params = $("#param-ok").val();	
	function _proc(resultado){	alert("proceasndoooojjjjjjjjj ok " + params);}
	var url = _url + WS_OBTENERTABLA;
	alert("antes ajax");
	ejecutar_ajax_ws(url, params, "Cargando consultas", _proc);
	alert("despues ajax");*/
////////////////////////////////////////////////////
	$.mobile.changePage( "#page-loading", { transition: "slideup", changeHash: true });

	obtener_consultas();
		
	$.mobile.changePage( "#page-principal", { transition: "slideup", changeHash: true });

	};

//$("#actualizar").addClass("ddddddddddddddd");

function ws_leer_url(){
	var url =acceso_ws_get_url();
	alert("leido " + url);
	$("#url_ws").val(url);
};

function ws_validar_clave(){
	var url  = $("#url_ws").val();
	acceso_ws_set_url(url);
	
	alert(url + " - Guardado!.");
	$.mobile.changePage( "#page-principal", { transition: "slideup", changeHash: true });
};

function row_datos_nueva(dato){
	return "<td class='row-dato'>" + dato + "</td>";
};

function ajax_cargar(url, params, nombre, id_tabla ){
	//alert("params:::::::::"+params);
	//alert("url:::::::::"+url);
	var ajax = $.ajax({
	url: url,
	data: params, 
	type: 'POST',
	contentType: "application/json; charset=utf-8",
	async: false,
	dataType: 'json',
	beforeSend: function () {
		$("#estado").html("Actualizando "+ nombre +" ...");
		//alert("before send");
	}
    });
    ajax.done(function (response) {
		//alert("DONEEEEE");
		//alert(response);		
		var resultado_json = $.parseJSON(response.d);
		//codigo | descripcion | resultado
		//alert("codigo: " + resultado_json.codigo);
		//alert("descripcion: " + resultado_json.descripcion);
		//alert("resultado: " + resultado_json.resultado);
		
		if(resultado_json.codigo !=100){//100 es ok
			alert("webService error cod: " + resultado_json.codigo);
			alert("webService error desc: " + resultado_json.descripcion);
			alert("res: " + resultado_json);
			for(var d in resultado_json){
				alert(d);
				alert(resultado_json[d]);
			}
		}else{


			//alert(resultado_json);
			//alert("fin ok--------------------------------");
			//onDone(resultado_json.resultado, id_tabla);
			/////////////////////////////////////////////////////////////////
			//limpio la tabla 
			$("#" + id_tabla + " tbody").empty();
			//$("#tbodyid").empty();
			var primera_vez = true;


			var columnas = [];					

			/*traigo las columnas del th para saber el orden en el que se tienen que cargar los datos*/
			var col_codigo;//el campo donde esta la columna codigo
			var tmp_col;
			$("#"+id_tabla + " thead th").each(function( index ) {
				tmp_col = $(this);
				var tmp_col_txt = tmp_col.text().replace(/\s+/g, '').toLowerCase();
				  //alert( index + ": " + $(this).text() );
				  columnas.push($(this).text());
				  //columnas.push(tmp_col_txt);

				  if(tmp_col.hasClass("ver_notas_codigo")){			  	
				  	col_codigo = tmp_col_txt;
				  	//alert("Tienen clase ver_nota-codigo col: " + col_codigo);
				  }
				  //col = columnas[columna].replace(/\s+/g, '').toLowerCase();
				});
			//alert(columnas.join("-"));
			var data = resultado_json.resultado;
			for (var i = 0; i < data.length; i++) {
				var rowData = data[i];
				//alert("rowData: " + rowData);
				var row = $("<tr/>");
				var col;
				if(primera_vez){
					//row.append($("<td class='primera'>  </td>"));
					$("#"+id_tabla).append("<tr class='primera'></tr>"); 		
					primera_vez = false;
				}		
				
				for(var columna in columnas){					
					/*
					 * esto es porque cuando lee las descripciones estan separadas por espacios y en el vector tienen que tener el nombre exacto
					 * Ej: Fecha Inicio => vector[Fecha Inicio] y deberia ser Fecha Inicio  => vector[fechainicio]
					 */
					col = columnas[columna].replace(/\s+/g, '').toLowerCase();

					row.append($(row_datos_nueva(rowData[col])));

					/*
					alert("columna: " + columna);
					alert("col:::"+col);
					alert("primero");
					for(var key in rowData) {
					    alert('----key: ' + key + '\n' + '----value: ' + rowData[key]);
						//rowData[key] = rowData[key].toLowerCase();
						key = key.toLowerCase();
					}
					alert("segundo");
					for(var key in rowData) {
					    alert('----key: ' + key + '\n' + '----value: ' + rowData[key]);
						//rowData[key] = rowData[key].toLowerCase();
					}
					alert("fin segundo ");
						
					alert("rowData[col]:::"+rowData[col]);
					alert("rowData[columna]:::"+rowData[columna]);
					*/

					/*
					if(rowData[col]!=null){
						alert(columnas[columna] + ": " + rowData[col]);
						//row.append($("<td>" + rowData[col] + "</td>"));
						row.append($(row_datos_nueva(rowData[col])));
					}
					else{
						if(rowData!='[object Object]'){
							alert("NULLLL " + col);
							//row.append($("<td>" + rowData + "</td>"));
							row.append($(row_datos_nueva(rowData)));
						}else{							
							//si viene por aca es porque el campo no existe en la consulta que devuelve el ws
							alert("col_codigo: " + col_codigo + " - rowData[col_codigo]: " + rowData[col_codigo]);
							var ver_click = "<div onclick=\"mostrar_nota_servicio('"+rowData[col_codigo]+"')\" class='btn_ver_notas'>Notas</<div>";
							row.append($("<td>" + ver_click+ "</td>"));							
						}
					}
					*/
				}//fin for		
				$("#"+id_tabla).append(row); 		
			}
			if(!primera_vez){//si es falso, tiene datos, agrego la ultima fila
				$("#"+id_tabla).append("<tr class='ultimo'></tr>"); 		
			}
			//row.append($("<td>  </td>"));							
			//alert("TERMINADO " + nombre);	
			////////////////////////////////////////////////////////////////
			//$("#estado").html(nombre + " OK");
			$("#estado").html("LatikaIT");

			//$("#"+id_tabla).table("refresh");
		}
				
		
    });
    ajax.fail(function (xhr, status) {
		$("#estado").html( nombre + " ERROR");
        alert("faillll-" + status + " - Url: " + url + " - params: " + params);
		if(xhr!=null)
			alert("xhr.responseText:"+xhr.responseText);
    });
    ajax.always(function () {
		//alert("allways");
		//$("#estado").html("OKOKOK");

    });

};

function mostrar_nota_servicio(servicio){
	//selecciono codigo    
    //var _url = "/serviciows.asmx/ObtenerNotasDeServicio";    
    ajax_mostrar_notas(servicio);
};


function ejecutar_ajax_ws(url, params, nombre, procesar){
	var ajax = $.ajax({
	url: url,
	data: params, 
	type: 'POST',
	contentType: "application/json; charset=utf-8",
	async: false,
	dataType: 'json',
	beforeSend: function () {
		$("#estado").html("Actualizando "+ nombre +" ...");
	}
    });
    ajax.done(function (response) {
		//alert("DONEEEEE");
		//alert(response);		
		var resultado_json = $.parseJSON(response.d);
		//codigo | descripcion | resultado
		//alert("codigo: " + resultado_json.codigo);
		//alert("descripcion: " + resultado_json.descripcion);
		//alert("resultado: " + resultado_json.resultado);
		
		if(resultado_json.codigo !=100){//100 es ok
			alert("webService error cod: " + resultado_json.codigo);
			alert("webService error desc: " + resultado_json.descripcion);
			alert("res: " + resultado_json);
			for(var d in resultado_json){
				alert(d);
				alert(resultado_json[d]);
			}
		}else{

			procesar(resultado_json.resultado);

/*
			//alert(resultado_json);
			//alert("fin ok--------------------------------");
			//onDone(resultado_json.resultado, id_tabla);
			/////////////////////////////////////////////////////////////////
			//limpio la tabla 
			$("#" + id_tabla + " tbody").empty();
			//$("#tbodyid").empty();
			var primera_vez = true;


			var columnas = [];					

			//traigo las columnas del th para saber el orden en el que se tienen que cargar los datos
			var col_codigo;//el campo donde esta la columna codigo
			var tmp_col;
			$("#"+id_tabla + " thead th").each(function( index ) {
				tmp_col = $(this);
				var tmp_col_txt = tmp_col.text().replace(/\s+/g, '').toLowerCase();
			  //alert( index + ": " + $(this).text() );
			  columnas.push($(this).text());
			  //columnas.push(tmp_col_txt);

			  if(tmp_col.hasClass("ver_notas_codigo")){			  	
			  	col_codigo = tmp_col_txt;
			  	//alert("Tienen clase ver_nota-codigo col: " + col_codigo);
			  }
			  //col = columnas[columna].replace(/\s+/g, '').toLowerCase();
			});
			//alert(columnas.join("-"));
			var data = resultado_json.resultado;
			for (var i = 0; i < data.length; i++) {
				var rowData = data[i];
				//alert("rowData: " + rowData);
				var row = $("<tr/>");
				var col;
				if(primera_vez){
					//row.append($("<td class='primera'>  </td>"));
					$("#"+id_tabla).append("<tr class='primera'></tr>"); 		
					primera_vez = false;
				}		
				
				for(var columna in columnas){					
					
					 //esto es porque cuando lee las descripciones estan separadas por espacios y en el vector tienen que tener el nombre exacto
					 // Ej: Fecha Inicio => vector[Fecha Inicio] y deberia ser Fecha Inicio  => vector[fechainicio]
					 
					col = columnas[columna].replace(/\s+/g, '').toLowerCase();
					//alert("columna: " + columna);
					if(rowData[col]!=null){
						//alert(columnas[columna] + ": " + rowData[col]);
						//row.append($("<td>" + rowData[col] + "</td>"));
						row.append($(row_datos_nueva(rowData[col])));
						//para_seleccionar_codigo
						
						//if(col=="codigo")
						//	row.append($("<td class='para_seleccionar_codigo'>" + rowData[col] + "</td>"));
						//else
						//	row.append($("<td>" + rowData[col] + "</td>"));
						
					}
					else{
						if(rowData!='[object Object]'){
							//alert("NULLLL " + col);
							//row.append($("<td>" + rowData + "</td>"));
							row.append($(row_datos_nueva(rowData)));
						}else{							
							//si viene por aca es porque el campo no existe en la consulta que devuelve el ws
							//alert("col_codigo: " + col_codigo + " - rowData[col_codigo]: " + rowData[col_codigo]);
							var ver_click = "<div onclick=\"mostrar_nota_servicio('"+rowData[col_codigo]+"')\" class='btn_ver_notas'>Notas</<div>";
							row.append($("<td>" + ver_click+ "</td>"));							
						}
					}
				}//fin for		
				$("#"+id_tabla).append(row); 		
			}
			if(!primera_vez){//si es falso, tiene datos, agrego la ultima fila
				$("#"+id_tabla).append("<tr class='ultimo'></tr>"); 		
			}
*/

			//row.append($("<td>  </td>"));							
			//alert("TERMINADO " + nombre);	
			////////////////////////////////////////////////////////////////
			//$("#estado").html(nombre + " OK");
			$("#estado").html("LatikaIT");
			//$("#"+id_tabla).table("refresh");
		}
				
		
    });
    ajax.fail(function (xhr, status) {
		$("#estado").html( nombre + " ERROR");
        alert("faillll-" + status + " - Url: " + url + " - params: " + params);
    });
    ajax.always(function () {
		//alert("allways");
		//$("#estado").html("OKOKOK");

    });
}


//consulta.prop: {codigo, nombreTabla, nombreAMostrar, filtro, orden, ordenBy}
function consulta_agregar_en_menu(consulta){
	
	var nueva_consulta = "<li><a href='#page-"+consulta.nombreTabla+"-"+consulta.codigo+"'  data-transition='slide'>"+consulta.nombreAMostrar+"</a></li>";
	$("#main-ul-consultas-disponibles").append(nueva_consulta);
}




//consulta.prop: {codigo, nombreTabla, nombreAMostrar, filtro[]{.nombre, tipo, filtro}, orden, ordenBy}
function consulta_agregar_page(consulta){
	//alert("pag OKe");
	var page = "";
	//var template = "<h1>{{firstName}} {{lastName}}</h1>Blog: {{blogURL}}";
	//var html = Mustache.to_html(template, person);
	//$('#sampleArea').html(html);
	var id = consulta_get_id_html(consulta);

	//page = $("body").append($("<div>").append($("<div>").append($("<h1>tiulo</h1>"))).append($("<div>contenttt</div>"))	);​
	var page = "														\
	<div data-role='page' id='"+id+"'>     \
		<div data-role='header' data-position='fixed'>                    \
			<a href='#' class='ui-btn ui-icon-arrow-l ui-btn-icon-left ui-btn-icon-notext' data-rel='back' data-transition='slide'>Volver</a>   \
			<h1>"+consulta.nombreAMostrar+"</h1>	\
			<button id='actualizar' class='ui-btn ui-icon-refresh ui-btn-icon-left ui-btn-icon-notext' >Actualizar</button>		\
		</div>		\
			<div data-role='main' class='ui-content'>		";
				
	

	//alert("len filter" + consulta.filtro.length);
	if(consulta.filtro.length>0){
		page = page + "\
			<div data-role='collapsible' class='filtros-colapsable'>		\
				<h1>Filtros</h1>";
		$.each(consulta.filtro, function(index, filtro){
			//alert("filtrooooo: "+filtro.filtrar);
			if(filtro.filtrar){
				var id_filtro = id + "-filtro-campo" + filtro.nombre.replace(" ", "");
				page =page+"\
				<div class='ui-field-contain filtro-para-seleccion' >		\
					<label for='"+id_filtro+"'>"+filtro.nombre+"</label>	\
					<input type='text' id='"+id_filtro+"' campo='"+filtro.nombre+"' tipo='"+filtro.tipo+"' condicion='"+filtro.condicion+"' data-type='search' placeholder='"+filtro.nombre+" ...'>	\
				</div>";
			}
		});
		page = page + "</div>";
	}


	var id_btn_buscar = id+"-filtro-buscar";
	var id_tabla = consulta_get_id_tabla_html(consulta);
	
	//alert("okok");
	page = page + "\
		<button class='ui-btn ui-icon-search ui-btn-icon-left boton-buscar-datos' codigo='"+consulta.codigo+"' id='"+id_btn_buscar+"'>Buscar</button>		\
				<table  id='"+id_tabla+"' data-role='table' class='ui-responsive ui-shadow agregar_ver_notas' >		\
					<thead>		\
					<tr>		";
	//alert("OKOKOKOKKOKO");

	//cargo las columnas
	$.each(consulta.filtro, function(index, columna){
		if(consulta.columnaCodigo.toLowerCase() == columna.nombre.toLowerCase()){
			//alert("encontro el codigo:"+columna.nombre);
			page = page + "<th class='ver_notas_codigo' >"+columna.nombre+"</th>";
		}
		else{
			page = page + "<th>"+columna.nombre+"</th>";
		}
	});

	page = page + "\
					</tr>		\
					</thead>	\
					<tbody>		\
					</tbody>	\
				</table>		\
			</div>		\
			<div data-role='footer'  class='centrado' data-position='fixed'>		\
				LatikaIT		\
			</div>		\
		</div>";

	//alert(page);
	//$("body").addClass("asdfadfasdfasd");
	$("body").append(page);
}
function obtener_consultas(){

	function _proc(resultado){
		//alert("proceasndoooo" + tabla);

		_consultas = resultado;

		if(_consultas.length>0){
			for (var i = 0; i < _consultas.length; i++) {
				//alert("varr " + i);
				var consulta = _consultas[i];

				consulta_agregar_en_menu(consulta);
				consulta_agregar_page(consulta);

				//for(var key in rowData) alert('----key: ' + key + '\n' + '----value: ' + rowData[key]);
				
				//alert( rowData);
			}
		}

		
		//alert("FIn proceasndoooooo ");
	}



	var url = _url + WS_OBTENERCONSULTAS;
	//alert("url:OBETNERCONSULTASS:"+url);
	//alert("antes ajax");
	ejecutar_ajax_ws(url, _params, "Cargando consultas", _proc);
	//alert("despues ajax");

}


function ajax_mostrar_notas(servicio) {
		var url = _url + WS_NOTASDESERVICIO;
		//var params = "{acceso: '" + _clave + "', servicio: 3786}";
		var params = "{acceso: '" + _clave + "', servicio: "+servicio+"}";
        var ajax = $.ajax({
            url: url,
            data: params,
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            async: false,
            dataType: 'json',
            beforeSend: function() {
                //$("#estado").html("Actualizando " + nombre + " ...");
            }
        });
        ajax.done(function(response) {
            //alert("DONEEEEE");
            //alert(response);		
            var resultado_json = $.parseJSON(response.d);
            //codigo | descripcion | resultado
            //alert("codigo: " + resultado_json.codigo);
            //alert("descripcion: " + resultado_json.descripcion);
            //alert("resultado: " + resultado_json.resultado);

            if (resultado_json.codigo != 100) {//100 es ok
                alert("webService error cod: " + resultado_json.codigo);
                alert("webService error desc: " + resultado_json.descripcion);
                alert("res: " + resultado_json);
                for (var d in resultado_json) {
                    alert(d);
                    alert(resultado_json[d]);
                }
            } else {
                //alert(resultado_json);                

                var data = resultado_json.resultado;
                var notas = "";
                for (var i = 0; i < data.length; i++) {
                    var rowData = data[i];
                    notas = notas + rowData["fecha"] + rowData["nota"] + "\n";
                }
                
                if (notas == "")
                    alert("Servicio: " + servicio + "\n" + "Sin notas");
                else
                    alert("Servicio: " + servicio + "\n" + notas);
                //alert("nNNNNNNNNNNNNNNN: " + notas);
                //alert("TERMINADO " );

                ////////////////////////////////////////////////////////////////
                //$("#estado").html(nombre + " OK");
                //alert(nombre + " OK");
            }


        });
        ajax.fail(function(xhr, status) {
            //$("#estado").html(nombre + " ERROR");
            //alert(xhr);
            alert("faillll-" + status + " - Url: " + url + " - params: " + params);
        });
        ajax.always(function() {
            //alert("allways");
            //$("#estado").html("OKOKOK");
        });
};

function consulta_get_id_tabla_html(consulta){
	 return consulta_get_id_html(consulta)+"-tabla";
}
function consulta_get_id_html(consulta){
	return "page-"+consulta.nombreTabla + "-" + consulta.codigo;
}

$(document).ready(function(){
	//alert("ready-indexok.js");
	_clave = acceso_ws_get_clave();
	_params = "{acceso: '"+_clave+"'}";
	_url = acceso_ws_get_url();
	//alert("_url:"+_url);
	_consultas = [];
	

	
	actualizar();

	//alert("finallllll");

	$(".boton-buscar-datos").click(function(){
		//alert("hokkk");

		var consulta_codigo = $(this).attr("codigo");
		//alert(consulta_codigo);

		//alert("lenn"+_consultas.length);

		$.grep(_consultas, function(consulta, index){
			

			//BUSCO LA CONSULTA
			//alert("compare: " + consulta.codigo + "__" + consulta_codigo);
			if(consulta.codigo != consulta_codigo)
				return;

			//alert(consulta.codigo);
			//alert(consulta.nombreTabla);
			
			var id = "#" +  consulta_get_id_html(consulta);
			//alert(id);

			//$(id + " .filtro-para-seleccion input").addClass("JJJJJJJJJ");
			var where = "";
			
			$(id + " .filtro-para-seleccion input").each(function(){
				//alert($(this).val());
				//alert("attr-"+$(this).attr("campo"));
				
				var valor = $(this).val();
				var campo = $(this).attr("campo");
				var tipo = $(this).attr("tipo");
				var condicion = $(this).attr("condicion");
				//alert("condicion:"+condicion);

				if(valor!=""){
					//si es un int
					if(tipo.indexOf("int") >= 0 ){
						//where = where + campo + " = \'"+-1+"\' and ";	
						switch(condicion){
						case "1":// int e igual = 
							where = where + campo + " = "+valor+" and ";	
							break;
						case "2"://int like '%' NO IMPLEMENTADO
							//here = where + campo + " like '+"valor"+%' ";	
							break;
						}						
					}else{
						//es un string!
						switch(condicion){
						case "1":// string e igual = 
							where = where + campo + " = '"+valor+"' and ";	
							break;
						case "2"://string like '%' 
							where = where + campo + " like '"+valor+"%' and ";	
							break;
						}						
					}
				}
				//alert("where::::::"+where);
				
			});

			where = where + " 1 = 1 ";

			//alert("where:"+where);
			var newparams = _params;
			var url = _url + WS_OBTENERTABLA;
			newparams = newparams.replace('}', ", tabla:'"+consulta.nombreTabla+"'}");
			newparams = newparams.replace('}', ", filtro:\"" + where+ "\"}");
			newparams = newparams.replace('}', ", orden:'"+consulta.orderBy+"'}");
			//alert("newparams:"+newparams);
			//$("#page-actores1-7-filtro-campoCodigoActor").val(newparams);

			var id_tabla = consulta_get_id_tabla_html(consulta);
			//alert("consulta_get_id_tabla_html:"+id_tabla);

			ajax_cargar(url, newparams, consulta.nombreAMostrar +"!", id_tabla);
			$("#"+id_tabla).table("refresh");

			//alert("TERMINADOOOO");
		});


	});


});
