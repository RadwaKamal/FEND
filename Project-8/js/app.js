'use strict'
// Foursquare keys 
const fs_client_id = '2KT4ES10N5VNN312FC4VZUAGWHWDZR5TQMZJ51HXGZ2ITD0P';
const fs_client_secret = '31Q4DUCGJI1S2K3K54TXSFV3TVDNBNLSVXQSGE31MDI05F4M';

// map global variable
let map;

// Listed locations 
const locations = [
    {
        name: 'Washington Park',
        position: {lat: 39.7889, lng: -89.6795}
    },
    {
        name: 'Abraham Lincoln Presidential Museum',
        position: {lat: 39.8028, lng: -89.64695}
    },
    {
        name: 'Dana Thomas House',
        position: {lat: 39.794, lng: -89.6513}
    },
    {
        name: 'Lincoln Park',
        position: {lat: 39.824, lng: -89.657}
    },
    {
        name: 'Illinois State Fairgrounds',
        position: {lat: 39.832, lng: -89.6408}
    }
];

// Location class
function Location (location) {
    let self = this;
    self.name = location.name;
    self.position = location.position;
	self.street = "";
    self.city = "";
    self.category = "";
    self.visible = ko.observable(true); // to be used for filtering (show / hide location)

    self.marker = new google.maps.Marker({
        map: map,
        position: self.position,
        title: self.name
    });

    // show / hide marker
	self.show_marker = ko.computed(() => {
		if(self.visible()) 
			self.marker.setMap(map);
        else 
            self.marker.setMap(null);
    }, self);

    let foursquare_call = `https://api.foursquare.com/v2/venues/search?ll=${self.position.lat},${self.position.lng}&client_id=${fs_client_id}&client_secret=${fs_client_secret}&v=20180425&query=${self.name}`;

	$.getJSON(foursquare_call).done((data) => {
        let results = data.response.venues[0];
        if (results) {
            let loc_info = results.location;
            self.street = loc_info.formattedAddress[0];
            self.city = loc_info.formattedAddress[1];
            if (results.categories.length) 
                self.category = results.categories[0].name;
        }
	}).fail(() => alert("An error occurred with Foursquare API call."));

    // add click event listener for marker
    let onClickMarker = () => {
        // set content info
        self.content = `<div class="info-window-content"><div class="title"><b>${self.name}</b></div>
            <div class="content">${self.street}</div>
            <div class="content">${self.city}</div>
            <div class="content">${self.category}</div></div>`;
        self.infowindow = new google.maps.InfoWindow({content: self.content});
        self.infowindow.open(map, self.marker);
        
        // bounce animation
		self.marker.setAnimation(google.maps.Animation.BOUNCE);
      	window.setTimeout(() => self.marker.setAnimation(null), 3000);
    }
	self.marker.addListener('click', onClickMarker);

    // add animation on clicking on a location from list
	self.bounce = () => google.maps.event.trigger(self.marker, 'click');
};

function AppViewModel() {
    let self = this;

    // Show map
	map = new google.maps.Map(document.getElementById('map'), {
        zoom: 13,
        center: {lat: 39.8089011, lng: -89.6395993}
    });

	self.keyword = ko.observable(""); // search keyword
	self.location_list = ko.observableArray([]); // location list
    
    // populate location list
	locations.forEach((location) => self.location_list.push(new Location(location)));

    // populate filtered locations 
	self.filtered_locations = ko.computed(() => {
		let keyword = self.keyword().toLowerCase();
		if (!keyword) {
			self.location_list().forEach((location) => location.visible(true));
			return self.location_list();
		}
        return ko.utils.arrayFilter(self.location_list(), (location) => {
            let location_name = location.name.toLowerCase();
            let has_keyword = (location_name.search(keyword) >= 0);
            location.visible(has_keyword);
            return has_keyword;
        });
	}, self);
}

function initApp() {
	ko.applyBindings(new AppViewModel());
}

function mapError() {
	alert("Google Maps failed to load. Please refresh the page and try again.");
}