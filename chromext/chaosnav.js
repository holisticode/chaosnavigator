/**
 * chaos navigator 0.1
 * 
 * @author: tawhuac
 */

var MAX_TITLE_SIZE = 35;
var req = new XMLHttpRequest();

/**
 * 
 * @param body
 */
function saveResource(body) {
	//alert("Going to send this body: " + body);	
	req.open(
	    "POST",
	    "http://localhost:3000/resources/save",
	    true);
	 //var body = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><tag><annotation>My trial</annotation><category>topic</category><context>my link mgmt</context><name>Link management</name><rating type=\"boolean\">true</rating><url>http://localhost:3000</url><user>fabio</user></tag>";
	req.onload = showResponse;
	req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	req.setRequestHeader("Content-length", body.length);
	req.setRequestHeader("Connection", "close");
	req.send(body);
}

/**
 * 
 */
function showResponse() {
	var code = req.status;	
	var text = req.responseXML.getElementsByTagName("response")[0].textContent;
    var div = document.createElement("div");    
    div.innerText  = text;
    document.body.appendChild(div);
}

/**
 * 
 */
function editTitle() {
	
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
	var name = document.getElementById("resource_title").innerHTML;
	var url  = document.getElementById("resource_url").value;
	var act  = getSelectedRadioValue("act");
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
	body += "<urgency>" + urgency + "</urgency>";
	body += "<context>" + context + "</context>";
	body += "<like>" + like + "</like>";
	body += "<annotation>" + annotations + "</annotation>";
	body += "</resource>";
	
	return body;
	
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
 * @param elem
 */
function addGeoTag(elem) {
	var tag = document.getElementById("new_geo_tag").value;
	var existing = document.getElementById("geo").value;
	var new_tag = existing + " " + tag;
	document.getElementById("geo").value = new_tag;
	document.getElementById("new_geo_tag").value = "";
	closeTagDialog();
}

/**
 * 
 */
function closeTagDialog() {
	document.getElementById("tag_dialog").style.visibility="hidden";
	document.getElementById("new_geo_tag").style.visibility="hidden";	
}

/**
 * 
 * @param elem
 */
function prepareView(elem) {
	
	chrome.tabs.getSelected(null, function(tab) {
		document.getElementById("resource_url").value=tab.url;
		var title = new String();
		title = tab.title;
		
		if (title.length > MAX_TITLE_SIZE) {
			document.getElementById("resource_title").setAttribute("title",title);
			title = title.substring(0, MAX_TITLE_SIZE);
			
			title = title + "...";
		}
		document.getElementById("resource_title").innerHTML=title;
	});
}

/**
 * 
 * @param tab
 */
function getSelectedTab(tab) {
	document.getElementById("resource_url").value=tab.url;
}

/**
 * 
 */
function showAddGeoTag() {
	document.getElementById("tag_dialog").style.visibility="visible";
	document.getElementById("new_geo_tag").style.visibility="visible";
	document.getElementById("new_geo_tag").focus();
}