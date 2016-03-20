/* tracks the state of tabs */

var tabs = {
	_state: {
		tabs: [],
		selected: null,
	},
	add: function (tab, index) {

		//make sure the tab exists before we create it
		if (!tab) {
			var tab = {};
		}

		var tabId = tab.id || Math.round(Math.random() * 100000000000000000); //you can pass an id that will be used, or a random one will be generated.

		var newTab = {
			url: tab.url || "",
			title: tab.title || "",
			id: tabId,
			lastActivity: tab.lastActivity || Date.now(),
			secure: tab.secure,
			private: tab.private || false,
			readerable: tab.readerable || false,
			backgroundColor: tab.backgroundColor,
			foregroundColor: tab.foregroundColor,
		}

		if (index) {
			currentTask.tabs._state.currentTask.tabs.splice(index, 0, newTab);
		} else {
			currentTask.tabs._state.currentTask.tabs.push(newTab);
		}


		return tabId;

	},
	update: function (id, data) {
		if (!currentTask.tabs.get(id)) {
			throw new ReferenceError("Attempted to update a tab that does not exist.");
		}
		var index = -1;
		for (var i = 0; i < this.length; i++) {
			if (this[i].id == id) {
				index = i;
			}
		}
		for (var key in data) {
			if (data[key] == undefined) {
				throw new ReferenceError("Key " + key + " is undefined.");
			}
			this[index][key] = data[key];
		}
	},
	destroy: function (id) {
		for (var i = 0; i < currentTask.tabs._state.currentTask.tabs.length; i++) {
			if (currentTask.tabs._state.tabs[i].id == id) {
				currentTask.tabs._state.currentTask.tabs.splice(i, 1);
				return i;
			}
		}
		return false;
	},
	get: function (id) {
		if (!id) { //no id provided, return an array of all tabs
			//it is important to deep-copy the tab objects when returning them. Otherwise, the original tab objects get modified when the returned tabs are modified (such as when processing a url).
			var tabsToReturn = [];
			for (var i = 0; i < currentTask.tabs._state.currentTask.tabs.length; i++) {
				tabsToReturn.push(JSON.parse(JSON.stringify(currentTask.tabs._state.tabs[i])));
			}
			return tabsToReturn;
		}
		for (var i = 0; i < currentTask.tabs._state.currentTask.tabs.length; i++) {
			if (currentTask.tabs._state.tabs[i].id == id) {
				return currentTask.tabs._state.tabs[i]
			}
		}
		return undefined;
	},
	getIndex: function (id) {
		for (var i = 0; i < currentTask.tabs._state.currentTask.tabs.length; i++) {
			if (currentTask.tabs._state.tabs[i].id == id) {
				return i;
			}
		}
		return -1;
	},
	getSelected: function () {
		return currentTask.tabs._state.selected;
	},
	getAtIndex: function (index) {
		return currentTask.tabs._state.tabs[index] || undefined;
	},
	setSelected: function (id) {
		if (!currentTask.tabs.get(id)) {
			throw new ReferenceError("Attempted to select a tab that does not exist.");
		}
		currentTask.tabs._state.selected = id;
	},
	count: function () {
		return currentTask.tabs._state.currentTask.tabs.length;
	},
	reorder: function (newOrder) { //newOrder is an array of [tabId, tabId] that indicates the order that tabs should be in
		currentTask.tabs._state.currentTask.tabs.sort(function (a, b) {
			return newOrder.indexOf(a.id) - newOrder.indexOf(b.id);
		});
	},
}

function isEmpty(tabList) {
	if (!tabList || tabList.length == 0) {
		return true;
	}

	if (tabList.length == 1 && (!tabList[0].url || tabList[0].url == "about:blank")) {
		return true;
	}

	return false;
}
