/* provides simple utilities for entering/exiting expanded tab mode */

var tabDragArea = tabContainer;

require.async("dragula", function (dragula) {

	window.dragRegion = dragula();

	//reorder the tab state when a tab is dropped
	dragRegion.on("drop", function () {

		var tabOrder = [];

		var tabElements = navbar.querySelectorAll(".tab-item");

		for (var i = 0; i < tabElements.length; i++) {
			var tabId = parseInt(tabElements[i].getAttribute("data-tab"));
			tabOrder.push(tabId);
		}

		currentTask.tabs.reorder(tabOrder);
	});

});

navbar.addEventListener("mousewheel", function (e) {
	if (e.deltaY < -30 && e.deltaX < 10) { //swipe down to expand tabs
		enterExpandedMode();
		e.stopImmediatePropagation();
	}
});

//event listener added in navbarcurrentTask.tabs.js
function handleExpandedModeTabItemHover(e) {
	if (isExpandedMode) {
		var item = this;
		setTimeout(function () {
			if (item.matches(":hover")) {
				switchToTab(item.getAttribute("data-tab"));
			}
		}, 125);
	}
}

var isExpandedMode = false;

function enterExpandedMode() {
	if (!isExpandedMode) {

		dragRegion.containers = [tabDragArea]; //only allow dragging tabs in expanded mode

		leaveTabEditMode();

		//get the subtitles

		currentTask.tabs.get().forEach(function (tab) {
			var prettyURL = urlParser.prettyURL(tab.url);

			console.log(tab);

			getTabElement(tab.id).querySelector(".secondary-text").textContent = prettyURL;
		});

		requestAnimationFrame(function () {

			document.body.classList.add("is-expanded-mode");
			navbar.focus();

		});

		isExpandedMode = true;
	}
}

function leaveExpandedMode() {
	if (isExpandedMode) {
		dragRegion.containers = [];
		document.body.classList.remove("is-expanded-mode");

		isExpandedMode = false;
	}
}

//when a tab is clicked, we want to minimize the tabstrip

navbar.addEventListener("click", function () {
	if (isExpandedMode) {
		leaveExpandedMode();
		getWebview(currentTask.tabs.getSelected()).focus();
	}
});
