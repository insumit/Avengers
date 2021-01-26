MapHandler = {
    markerList: [],
    nonGlowMarkerList: [],
    map: null,
    CityPoly: [],
    plotMarker: function (lat, lng, iconImage, id) {
        var myIcon1 = L.icon({
            iconUrl: iconImage,
            iconAnchor: [15, 2],
            iconSize: [14, 20]
        });
        var marker = L.marker([lat, lng], {
            icon: myIcon1,
            title: id
        }).addTo(MapHandler.map);
        return marker;
    },
    removeMarkersArray: function (markerArray) {
        var length = markerArray.length;
        while (length > 0) {
            var marker = markerArray.pop();
            MapHandler.map.removeLayer(marker);
            length--;
        }
    },
    getMarkers: function (resp, city_name) {
        var message = resp.message;
        var status = resp.status;
        if (message === "success" && status === 200) {
            $("#myBtn").on('click');
            if (resp.logo1 == 'default.png')
            {
                document.getElementById("logo1").src = "";
            } else
            {
                document.getElementById("logo1").src = "resources/images/" + resp.logo1;
            }
            document.getElementById("logo2").src = "resources/images/" + resp.logo2;
            var Totallights = resp.Totallights;
            var operational = resp.operational;
            var scheduleoff_time = resp.scheduleoff_time;
            var scheduleon_time = resp.scheduleon_time;
            var toatl_light_on = 0;
            if (Totallights !== null && Totallights !== undefined
                    && Totallights !== 0 && operational !== null
                    && operational !== undefined) {
                toatl_light_on = ((operational * 100) / Totallights).toFixed(2);
            }
            var currenttime = new Date();
            currenttime.toLocaleTimeString('en-GB');
            var ontimedate = new Date(scheduleon_time * 1000);
//            alert(ontimedate);
            var offtimedate = new Date(scheduleoff_time * 1000);
            var onbasetime = new Date();
            onbasetime.setHours(ontimedate.getHours(), ontimedate.getMinutes(), ontimedate.getSeconds());
            var offbasetime = new Date();
            offbasetime.setHours(offtimedate.getHours(), offtimedate.getMinutes(), offtimedate.getSeconds());
            var info = resp.info;
            var html = "";
            if (currenttime >= onbasetime || currenttime < offbasetime) {
                $('#lightson').html(resp.operational);
                $('#totalLights').html(resp.Totallights);
                $('#non_operational').html(resp.non_operational);
                $('#lightsoff').html(resp.non_operational);
                $('#energy_saving').html((resp.energy_saving_1).toFixed(2) + " KWH");
                $('#toatl_light_on').html(toatl_light_on + " %");
                if (city_name.toLowerCase() == 'narela') {
                    var onlights = resp.Totallights - 457;
                    toatl_light_on = ((onlights * 100) / resp.Totallights).toFixed(2);
                    $('#lightson').html(onlights);
                    $('#lightsoff').html("457");
                    $('#toatl_light_on').html(toatl_light_on + " %");
                }else if (city_name.toLowerCase() == 'rohini'){
                    var onlights = resp.Totallights - 671;
                    toatl_light_on = ((onlights * 100) / resp.Totallights).toFixed(2);
                    $('#lightson').html(onlights);
                    $('#lightsoff').html("671");
                    $('#toatl_light_on').html(toatl_light_on + " %");
                    
                    
                }
                var j = 1;
                for (var key in info) {
                    if ((info[key].latitude !== 0 && info[key].longitude !== 0)
                            && (info[key].latitude !== undefined && info[key].longitude !== undefined)) {
                        var currentr = info[key].dashcurrentmap.currentr == 'N-A' ? 0 : parseFloat(info[key].dashcurrentmap.currentr);
                        var currenty = info[key].dashcurrentmap.currenty == 'N-A' ? 0 : parseFloat(info[key].dashcurrentmap.currenty);
                        var currentb = info[key].dashcurrentmap.currentb == 'N-A' ? 0 : parseFloat(info[key].dashcurrentmap.currentb);
                        var current = currentr + currenty + currentb;
                        if (info[key].connectionstatus === true) {
                            /*  
                             if (info[key].mode === true && info[key].contactorfailure === true && info[key].mcbtrip === true) {
                             
                             MapHandler.plotMarkerOnMap(info[key].latitude, info[key].longitude, "resources/images/a_red.png",
                             info[key].device_id, info[key].ccms_name, info[key].connectedload, info[key].total_lights,
                             info[key].location, "(OFF)");
                             
                             } else if (info[key].mode === true && info[key].contactorfailure === false && info[key].mcbtrip === true) {
                             MapHandler.plotMarkerOnMap(info[key].latitude, info[key].longitude, "resources/images/a_red.png",
                             info[key].device_id, info[key].ccms_name, info[key].connectedload, info[key].total_lights,
                             info[key].location, "(OFF)");
                             
                             
                             } else if (info[key].mode === true && info[key].contactorfailure === true && info[key].mcbtrip === false) {
                             
                             MapHandler.plotMarkerOnMap(info[key].latitude, info[key].longitude, "resources/images/a_red.png",
                             info[key].device_id, info[key].ccms_name, info[key].connectedload, info[key].total_lights,
                             info[key].location, "(OFF)");
                             
                             
                             } else if (info[key].mode === true && info[key].contactorfailure === false && info[key].mcbtrip === false) {
                             
                             
                             if (current >= 0.1 || (info[key].dashcurrentmap.currentr == 'N-A' || info[key].dashcurrentmap.currenty == 'N-A' || info[key].dashcurrentmap.currentb == 'N-A'))
                             {
                             MapHandler.plotMarkerOnMap(info[key].latitude, info[key].longitude, "resources/images/a_green.png",
                             info[key].device_id, info[key].ccms_name, info[key].connectedload, info[key].total_lights,
                             info[key].location, "(ON)");
                             
                             } else
                             {
                             MapHandler.plotMarkerOnMap(info[key].latitude, info[key].longitude, "resources/images/a_red.png",
                             info[key].device_id, info[key].ccms_name, info[key].connectedload, info[key].total_lights,
                             info[key].location, "(OFF)");
                             }
                             
                             } else if (info[key].mode === false) {
                             
                             if (info[key].Switch_status === "1") {
                             
                             MapHandler.plotMarkerOnMap(info[key].latitude, info[key].longitude, "resources/images/a_green.png",
                             info[key].device_id, info[key].ccms_name, info[key].connectedload, info[key].total_lights,
                             info[key].location, "(ON)");
                             } else {
                             
                             MapHandler.plotMarkerOnMap(info[key].latitude, info[key].longitude, "resources/images/a_red.png",
                             info[key].device_id, info[key].ccms_name, info[key].connectedload, info[key].total_lights,
                             info[key].location, "(OFF)");
                             }
                             
                             }*/
                            if (info[key].Switch_status === "1") {
                                MapHandler.plotMarkerOnMap(info[key].latitude, info[key].longitude, "resources/images/a_green.png",
                                        info[key].device_id, info[key].ccms_name, info[key].connectedload, info[key].total_lights,
                                        info[key].location, "(ON)");
                            } else {
                                MapHandler.plotMarkerOnMap(info[key].latitude, info[key].longitude, "resources/images/a_red.png",
                                        info[key].device_id, info[key].ccms_name, info[key].connectedload, info[key].total_lights,
                                        info[key].location, "(OFF)");
                            }
                        } else {
                            MapHandler.plotMarkerOnMap(info[key].latitude, info[key].longitude, "resources/images/a_green.png",
                                    info[key].device_id, info[key].ccms_name, info[key].connectedload, info[key].total_lights,
                                    info[key].location, "(ON)");
                        }
                    }
                }
            } else {
                $('#lightson').html(0);
                $('#totalLights').html(resp.Totallights);
                $('#lightsoff').html(resp.Totallights);
                $('#energy_saving').html((resp.energy_saving_1).toFixed(2) + " KWH");
                $('#toatl_light_on').html(0 + " %");
                var lastnonop = 0;
                for (var key in info) {
                    lastnonop = lastnonop + info[key].last_nonoperational;
                    if ((info[key].latitude !== 0 && info[key].longitude !== 0) &&
                            (info[key].latitude !== undefined && info[key].longitude !== undefined)) {

                        var currentr = info[key].dashcurrentmap.currentr == 'N-A' ? 0 : parseFloat(info[key].dashcurrentmap.currentr);
                        var currenty = info[key].dashcurrentmap.currenty == 'N-A' ? 0 : parseFloat(info[key].dashcurrentmap.currenty);
                        var currentb = info[key].dashcurrentmap.currentb == 'N-A' ? 0 : parseFloat(info[key].dashcurrentmap.currentb);
                        var current = currentr + currenty + currentb;
                        if (info[key].connectionstatus === true) {
                            /*                     
                             if (info[key].mode === true && info[key].contactorfailure === true && info[key].mcbtrip === true) {
                             MapHandler.plotMarkerOnMap(info[key].latitude, info[key].longitude, "resources/images/a_red.png",
                             info[key].device_id, info[key].ccms_name, info[key].connectedload, info[key].total_lights,
                             info[key].location, "(OFF)");
                             } else if (info[key].mode === true && info[key].contactorfailure === false && info[key].mcbtrip === true) {
                             MapHandler.plotMarkerOnMap(info[key].latitude, info[key].longitude, "resources/images/a_red.png",
                             info[key].device_id, info[key].ccms_name, info[key].connectedload, info[key].total_lights,
                             info[key].location, "(OFF)");
                             } else if (info[key].mode === true && info[key].contactorfailure === true && info[key].mcbtrip === false) {
                             MapHandler.plotMarkerOnMap(info[key].latitude, info[key].longitude, "resources/images/a_red.png",
                             info[key].device_id, info[key].ccms_name, info[key].connectedload, info[key].total_lights,
                             info[key].location, "(OFF)");
                             } else if (info[key].mode === true && info[key].contactorfailure === false && info[key].mcbtrip === false) {
                             
                             
                             if (current < 0.1) {
                             
                             MapHandler.plotMarkerOnMap(info[key].latitude, info[key].longitude, "resources/images/a_red.png",
                             info[key].device_id, info[key].ccms_name, info[key].connectedload, info[key].total_lights,
                             info[key].location, "(OFF)");
                             } else {
                             
                             
                             MapHandler.plotMarkerOnMap(info[key].latitude, info[key].longitude, "resources/images/a_green.png",
                             info[key].device_id, info[key].ccms_name, info[key].connectedload, info[key].total_lights,
                             info[key].location, "(ON)");
                             }
                             
                             } else if (info[key].mode === false) {
                             
                             
                             if (info[key].Switch_status === "1") {
                             
                             MapHandler.plotMarkerOnMap(info[key].latitude, info[key].longitude, "resources/images/a_green.png",
                             info[key].device_id, info[key].ccms_name, info[key].connectedload, info[key].total_lights,
                             info[key].location, "(ON)");
                             } else {
                             
                             MapHandler.plotMarkerOnMap(info[key].latitude, info[key].longitude, "resources/images/a_red.png",
                             info[key].device_id, info[key].ccms_name, info[key].connectedload, info[key].total_lights,
                             info[key].location, "(OFF)");
                             }
                             
                             }
                             
                             */
                            if (info[key].Switch_status === "1") {
                                MapHandler.plotMarkerOnMap(info[key].latitude, info[key].longitude, "resources/images/a_green.png",
                                        info[key].device_id, info[key].ccms_name, info[key].connectedload, info[key].total_lights,
                                        info[key].location, "(ON)");
                            } else {
                                MapHandler.plotMarkerOnMap(info[key].latitude, info[key].longitude, "resources/images/a_red.png",
                                        info[key].device_id, info[key].ccms_name, info[key].connectedload, info[key].total_lights,
                                        info[key].location, "(OFF)");
                            }
                        } else
                        {
                            MapHandler.plotMarkerOnMap(info[key].latitude, info[key].longitude, "resources/images/a_red.png",
                                    info[key].device_id, info[key].ccms_name, info[key].connectedload, info[key].total_lights,
                                    info[key].location, "(OFF)");
                        }
                    }
                }
                $('#non_operational').html(lastnonop);
            }
            var group = new L.featureGroup(MapHandler.markerList);
            MapHandler.map.fitBounds(group.getBounds());
        } else if (status === 201) {
            $("#myBtn").off('click');
            $("#getCodeModal").modal("show");
            $('#alertMessage').html("No devices associated with this city name.");
            $('#lightson').html(0);
            $('#non_operational').html(0);
            $('#totalLights').html(0);
            $('#lightsoff').html(0);
            $('#energy_saving').html(0 + " KWH");
            $('#toatl_light_on').html(0 + " %");
            if (resp.logo1 == 'default.png')
            {
                document.getElementById("logo1").src = "";
            } else
            {
                document.getElementById("logo1").src = "resources/images/" + resp.logo1;
            }
            document.getElementById("logo2").src = "resources/images/" + resp.logo2;
        } else {
            $("#myBtn").off('click');
            $("#getCodeModal").modal("show");
            $('#alertMessage').html("This city can not found. Please provide correct city name.");
            $('#lightson').html(0);
            $('#totalLights').html(0);
            $('#lightsoff').html(0);
            $('#non_operational').html(0);
            $('#energy_saving').html(0 + " KWH");
            $('#toatl_light_on').html(0 + " %");
            document.getElementById("logo1").src = "";
        }
        document.getElementById("nonoperational_nav").style.width = "0";
    },
    getNonGlowingMarkers: function (resp) {
        var j = 1;
        var html = "";
        var info = resp.info;
        var scheduleoff_time = resp.scheduleoff_time;
        var scheduleon_time = resp.scheduleon_time;
        var currenttime = new Date();
        currenttime.toLocaleTimeString('en-GB');
        var ontimedate = new Date(scheduleon_time * 1000);
        var offtimedate = new Date(scheduleoff_time * 1000);
        var onbasetime = new Date();
        onbasetime.setHours(ontimedate.getHours(), ontimedate.getMinutes(), ontimedate.getSeconds());
        var offbasetime = new Date();
        offbasetime.setHours(offtimedate.getHours(), offtimedate.getMinutes(), offtimedate.getSeconds());
        var total = 0;
        for (var key in info) {
            var tableRow = '';
            var non_operational = 0;
            if (currenttime >= onbasetime || currenttime < offbasetime) {
                non_operational = info[key].non_operationallights;
            } else {
                non_operational = info[key].last_nonoperational;
            }
            if (info[key].mode === true) {
                if (info[key].connectionstatus === true) {
                    tableRow = '<tr onclick=MapHandler.showOnMap(' + info[key].device_id + ')> <td> ' + j + '</td>'
                            + '<td>' + info[key].ccms_name + '</td>'
                            + '<td>' + info[key].location + '</td>'
                            + '<td>' + non_operational + '</td>'
                            + '</tr>';
                    j = j + 1;

                    if ((info[key].latitude !== 0 && info[key].longitude !== 0) &&
                            (info[key].latitude !== undefined && info[key].longitude !== undefined)) {

                        MapHandler.plotMarkerOnMap(info[key].latitude, info[key].longitude, "resources/images/a_pink.png",
                                info[key].device_id, info[key].ccms_name, info[key].connectedload, info[key].total_lights,
                                info[key].location, "(Manual Mode)", 1);
                    }
                }
            } else {
                if (non_operational !== 0) {

                    tableRow = '<tr onclick=MapHandler.showOnMap(' + info[key].device_id + ')> <td> ' + j + '</td>'
                            + '<td >' + info[key].ccms_name + '</td>'
                            + '<td>' + info[key].location + '</td>'
                            + '<td>' + non_operational + '</td>'
                            + '</tr>';
                    j = j + 1;

                    if ((info[key].latitude !== 0 && info[key].longitude !== 0) &&
                            (info[key].latitude !== undefined && info[key].longitude !== undefined)) {

                        MapHandler.plotMarkerOnMap(info[key].latitude, info[key].longitude, "resources/images/a_blue.png",
                                info[key].device_id, info[key].ccms_name, info[key].connectedload, info[key].total_lights,
                                info[key].location, "(Lamp Failure)", 1);
                    }
                } else if (non_operational === 0 && info[key].isfaulty === true) {

                    if (info[key].connectionstatus === true) {
                        tableRow = '<tr onclick=MapHandler.showOnMap(' + info[key].device_id + ')> <td> ' + j + '</td>'
                                + '<td>' + info[key].ccms_name + '</td>'
                                + '<td>' + info[key].location + '</td>'
                                + '<td>' + non_operational + '</td>'
                                + '</tr>';
                        j = j + 1;

                        if ((info[key].latitude !== 0 && info[key].longitude !== 0) &&
                                (info[key].latitude !== undefined && info[key].longitude !== undefined)) {

                            MapHandler.plotMarkerOnMap(info[key].latitude, info[key].longitude, "resources/images/a_yellow.png",
                                    info[key].device_id, info[key].ccms_name, info[key].connectedload, info[key].total_lights,
                                    info[key].location, "(Fault)", 1);
                        }
                    }
                }
            }


            html = html + tableRow;

        }
        var group = new L.featureGroup(MapHandler.nonGlowMarkerList);
        MapHandler.map.fitBounds(group.getBounds());
        $('#switchPointList tbody').html(html);
    },
    plotCityGeom: function (geojson) {
        var myStyle = {
            "color": 'BLACK',
            "fillColor": 'BLACK',
            "weight": 1,
            "fillOpacity": 0.1
        };
        var geojsonData = {
            "type": "Feature",
            "geometry": geojson
        };
        var polyLayer = L.geoJson(geojsonData, {
            style: myStyle
        }).addTo(MapHandler.map);
        MapHandler.CityPoly.push(polyLayer);
    },
    clearCityPoly: function () {
        if (MapHandler.CityPoly.length > 0) {
            var currentPoly = MapHandler.CityPoly.pop();
            MapHandler.map.removeLayer(currentPoly);
            MapHandler.clearCityPoly();
        }
    },
    showOnMap: function (id) {
        for (var i in MapHandler.nonGlowMarkerList) {
            var markerID = MapHandler.nonGlowMarkerList[i].options.title;
            if (markerID == id) {
                MapHandler.nonGlowMarkerList[i].openPopup();
            }
        }
    },
    readyFunction: function (city_name, resp, the_geom) {
        var Capitalname = city_name.charAt(0).toUpperCase() + city_name.substr(1).toLowerCase();
        var arr = city_name.split(' ');
        var lp;
        for (lp = 0; lp < arr.length; lp++)
        {
            arr[lp] = arr[lp].charAt(0).toUpperCase() + arr[lp].substr(1).toLowerCase();
        }
        var j;
        for (j = 0; j < arr.length - 1; j++)
        {
            arr[j] = arr[j] + " ";
        }

        $('#Dashboardname').html(arr);
        if (the_geom != 0) {
            MapHandler.plotCityGeom(the_geom);
        }
        document.getElementById("nonoperational_nav").style.width = "0";
        document.getElementById("nonoperational_nav").style.right = "-480px";
        $('#closebutton').click(function () {
            document.getElementById("nonoperational_nav").style.width = "0";
            document.getElementById("nonoperational_nav").style.right = "-480px";
            MapHandler.getMarkers(resp, city_name);
        });
        $('#myBtn').click(function () {
            document.getElementById("nonoperational_nav").style.width = "480px";
            document.getElementById("nonoperational_nav").style.right = "0px";
            MapHandler.removeMarkersArray(MapHandler.markerList);
            MapHandler.getNonGlowingMarkers(resp);
        });
        MapHandler.getMarkers(resp, city_name);
        if (city_name.toLowerCase() == 'narela' ){//|| city_name.toLowerCase() == 'north delhi' || city_name.toLowerCase() == 'rohini') {
            $("#myBtn").off('click');
            var html = '<form name="myRedirectForm" target="_blank" action="https://smartlight.aatapaha.com/aatapaha/login" method="post">'
                    + '<input name="userName" type="hidden" value="narela@havells.com" />'
                    + '<input name="password" type="hidden" value="narela1" />'
                    + '<input type="submit" value="Go to Web Application" style= "color:black" id="redirectBtn"/>'
                    + '</form>';
            $('#cumulative_saving').html(html);
            if (city_name.toLowerCase() == 'narela') {
                $('#non_operational').html("457");
            }
              
        }else if ( city_name.toLowerCase() == 'rohini') {
            $("#myBtn").off('click');
            var html = '<form name="myRedirectForm" target="_blank" action="https://smartlight.aatapaha.com/aatapaha/login" method="post">'
                    + '<input name="userName" type="hidden" value="rohini@havells.com" />'
                    + '<input name="password" type="hidden" value="rohini123" />'
                    + '<input type="submit" value="Go to Web Application" style= "color:black" id="redirectBtn"/>'
                    + '</form>';
            $('#cumulative_saving').html(html);
           
              if (city_name.toLowerCase() == 'rohini') {
                $('#non_operational').html("671");
            }

        } else if ( city_name.toLowerCase() == 'north delhi' ) {
            $("#myBtn").off('click');
            var html = '<form name="myRedirectForm" target="_blank" action="https://smartlight.aatapaha.com/aatapaha/login" method="post">'
                    + '<input name="userName" type="hidden" value="ndmc@havells.com" />'
                    + '<input name="password" type="hidden" value="havells12345" />'
                    + '<input type="submit" value="Go to Web Application" style= "color:black" id="redirectBtn"/>'
                    + '</form>';
            $('#cumulative_saving').html(html);
//            if (city_name.toLowerCase() == 'narela') {
//                $('#non_operational').html("608");
//            }
//              if (city_name.toLowerCase() == 'rohini') {
//                $('#non_operational').html("730");
//            }

        }
    },
    plotMarkerOnMap: function (latitude, longitude, imagePath,
            device_id, ccms_name, connectedload, total_lights,
            location, title, listFlag) {
        var marker = MapHandler.plotMarker(latitude, longitude, imagePath, device_id);
        marker.bindPopup("<p>"
                + ccms_name + " " + title
                + "</p><p> Total Connected Load :"
                + connectedload + " Watt"
                + "</p><p>Total no. of Lights Connected :"
                + total_lights + " no's"
                + "</p><p> Landmark : "
                + location
                + "</p><p> Latitude : "
                + latitude + " Longitude :" + longitude
                + "</p>");
        if (listFlag === 1) {
            MapHandler.nonGlowMarkerList.push(marker);
        } else {
            MapHandler.markerList.push(marker);
        }
    }
};