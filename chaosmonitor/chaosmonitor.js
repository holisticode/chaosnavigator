/**
 * chaos navigator 0.1
 * 
 * @author: tawhuac
 */
var script = document.createElement('script');
script.src = 'jquery-1.7.1.js';
script.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(script);


var MAX_TITLE_SIZE = 39;
var req = new XMLHttpRequest();
var tagnode = "<tag>";
var ctagnode = "</tag>";
var typenode = "<type>";
var ctypenode = "</type>";
var content = "<content>";
var ccontent = "</content>";

/**
 * 
 * @param body
 */
	    //"http://localhost:3000/resources/filter?todo=" + action +"&urgency=" + urgency + "&keywords=" + keywords,
function get(body) {
	//alert("Going to send this body: " + body);	
    var actionid = document.getElementById("byAction").selectedIndex;
    var action = document.getElementById("byAction").options[actionid].text;
	action = action.charAt(0).toUpperCase() + action.slice(1);
    var urgencyid = document.getElementById("byUrgency").selectedIndex;
    var urgency = document.getElementById("byUrgency").options[urgencyid].text;
	urgency = urgency.charAt(0).toUpperCase() + urgency.slice(1);
    var keywords = document.getElementById("keywords").value;
    var base = "http://growing-stone-957.heroku.com/resources/filter?todo=";
    var url = base + action +"&urgency=" + urgency + "&keywords=" + keywords;
	req.open(
	    "GET",
        url,
	    true);
	 //var body = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><tag><annotation>My trial</annotation><category>topic</category><context>my link mgmt</context><name>Link management</name><rating type=\"boolean\">true</rating><url>http://localhost:3000</url><user>fabio</user></tag>";
	req.onload = showResponse;
	req.setRequestHeader("Connection", "close");
	req.send();
}

/**
 * 
 */
function showResponse() {
    
	var code = req.status;	
	var text = req.responseText;
	var obj = JSON.parse(text);
    //var obj = jQuery.parseJSON(text);
    var div = document.getElementById("tag_results");    
	div.innerHTML="";
    for(var x=0; x < obj.length; x++) {
             var resource = obj[x];
             var res = '<div class="resource" id="'+resource.resource.id+'"> Resource: <a href="'  + resource.resource.url + '" onclick="window.open(this.href);" >' + resource.resource.name + '</a><br></div> ';
             //div.appendChild(res);
		    div.innerHTML = div.innerHTML + res;
        }
}

/**
 * 
 */
function leaveTitleEdit(event, input) {
	if (event.keyCode == 13) {
		input.blur();
	}
}

/**
 * 
 */
function actions() {
	var dialog = document.getElementById("actions_dialog");
	dialog.style.visibility = "visible";
}

/**
 * 
 */
function hideActions() {
	var selected = getSelectedRadioValue("actions");
	if (selected != null) {
		document.getElementById("selectedAction").innerText = selected;
	}
	var dialog = document.getElementById("actions_dialog");
	dialog.style.visibility = "hidden";
}

/**
 * 
 * @param elem
 */
function makeSaveActive(elem) {
	elem.src = "images/save-active.png";
}

/**
 * 
 * @param elem
 */
function makeSaveInactive(elem) {
	elem.src = "images/save-inactive.png";
}

/**
 * 
 */
function save() {
	var body = buildPOSTbodyXML();
	saveResource(body);
}
/**
 * 
 * @returns {String}
 */
function buildPOSTbodyXML() {
	var body = new String("<?xml version='1.0' encoding='UTF-8'?>");
	var name = document.getElementById("resource_title").value;
	var url  = document.getElementById("resource_url").value;
	var act  = getSelectedRadioValue("act");
	var action = getSelectedRadioValue("actions");
	var urgency = getSelectedRadioValue("urgent");
	var context = document.getElementById("resource_context").value;
	var likestr = getSelectedRadioValue("like");
	var like = "true";
	if (likestr != "Like") {
		like = "false";
	}
	var annotations = document.getElementById("annotations").value;
	
	body += "<resource><name>" + name + "</name>";
	body += "<url>" + url + "</url>";
	body += "<actiontype>" + act + "</actionType>";
	body += addNodeIfSet("action", action);
	body += addNodeIfSet("urgency", urgency);
	body += "<context>" + context + "</context>";
	body += "<like>" + like + "</like>";
	body += "<annotation>" + annotations + "</annotation>";
	
	var tag_array = buildTagArray();
	body += buildTagXML(tag_array);
	
	body += "</resource>";
	
	return body;
	
}

/**
 * 
 * @param action
 * @returns {String}
 */
function addNodeIfSet(tag, content) {
	if ( (content != null) && (content != "undefined") ) {
		return "<" + tag + ">" + content + "</" + tag + ">";
	} 
}

/**
 * 
 * @returns {Array}
 */
function buildTagArray() {
	
	var geotagstring = document.getElementById("geo").value;
	var geotags = geotagstring.split(',');
	geotags.name = "geo";
	var topictagstring = document.getElementById("topic").value;
	var topictags = topictagstring.split(',');
	topictags.name = "topic";
	var culttagstring = document.getElementById("cult").value;
	var culttags = culttagstring.split(',');
	culttags.name = "cultural";
	
	var tag_array = new Array(geotags, topictags, culttags);
	return tag_array;
}

function buildTagXML(tags_array) {
	
	var tagxml = "<tags>";
	for (var t=0; t<tags_array.length; t++) {
		
		for (var i=0; i<tags_array[t].length; i++) {
			var newtag = tagnode;
			newtag += typenode + tags_array[t].name + ctypenode;
			newtag += content + tags_array[t][i] + ccontent; 
			newtag += ctagnode;
			tagxml += newtag;
		}
		
	}
	
	tagxml += "</tags>";
	return tagxml;	
}

/**
 * 
 * @param element_name
 * @returns
 */
function getSelectedRadioValue(element_name) {
	var act  = document.getElementsByName(element_name);
	for (var i=0; i<act.length; i++) {
		var radio = act[i];
		if (radio.checked == true ) {
			return radio.value;
		}
	}
}


/**
 * 
 * @param tag_type
 */
function addTag(tag_type) {
	var input_id = "new_" + tag_type + "_tag"; 
	var tag = document.getElementById(input_id).value;
	var existing = document.getElementById(tag_type).value;
	var new_tag = existing + " " + tag;
	document.getElementById(tag_type).value = new_tag;
	document.getElementById(input_id).value = "";
	closeTagDialog(tag_type);
}

/**
 * 
 */
function closeTagDialog(tag) {
	var dialog_id = tag + "_tag_dialog";
	var input_id = "new_" + tag + "_tag";
	document.getElementById(dialog_id).style.visibility="hidden";
	document.getElementById(input_id).style.visibility="hidden";	
}

/**
 * 
 * @param elem
 */
function prepareView(elem) {
	
	//build the lists options:
	
	//the action filter:
	loadActionFilterValues();
	//the urgency filter:
	loadUrgencyFilterValues();
}


function loadActionFilterValues() {
	var actions = getListOfActions();
	var select = document.getElementById("byAction");
	
	for(index in actions) {
	    select.options[select.options.length] = new Option(actions[index], index);
	}
	
	select.options[select.options.length] = new Option("All", index + 1);
}

function getListOfActions() {
	var act_arr = ["read", "work","investigate","evaluate","forward","invite"];
	return act_arr;
}

function getResourcesByAction() {
	var select = document.getElementById("byAction");
	
	var action = select.options.value;
	
	get(action);
	
}

function loadUrgencyFilterValues() {
	var act_arr = ["urgent", "important", "follow-up"];
	
	var select = document.getElementById("byUrgency");
	
	for(index in act_arr) {
	    select.options[select.options.length] = new Option(act_arr[index], index);
	}
	
	select.options[select.options.length] = new Option("All", index + 1);
}
/**
 * 
 * @param tab
 */
function getSelectedTab(tab) {
	document.getElementById("resource_url").value=tab.url;
}

function showAddTagDialog(tag) {
	var dialog_id = tag + "_tag_dialog";
	var input_id = "new_" + tag + "_tag";
	document.getElementById(dialog_id).style.visibility="visible";
	document.getElementById(input_id).style.visibility="visible";
	document.getElementById(input_id).focus();
}
