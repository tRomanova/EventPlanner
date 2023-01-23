var events = [{
    event: "ComicCon",
    city: "New York",
    state: "New York",
    attendance: 240000,
    date: "06/01/2017",
},
{
    event: "ComicCon",
    city: "New York",
    state: "New York",
    attendance: 250000,
    date: "06/01/2018",
},
{
    event: "ComicCon",
    city: "New York",
    state: "New York",
    attendance: 257000,
    date: "06/01/2019",
},
{
    event: "ComicCon",
    city: "San Diego",
    state: "California",
    attendance: 130000,
    date: "06/01/2017",
},
{
    event: "ComicCon",
    city: "San Diego",
    state: "California",
    attendance: 140000,
    date: "06/01/2018",
},
{
    event: "ComicCon",
    city: "San Diego",
    state: "California",
    attendance: 150000,
    date: "06/01/2019",
},
{
    event: "HeroesCon",
    city: "Charlotte",
    state: "North Carolina",
    attendance: 40000,
    date: "06/01/2017",
},
{
    event: "HeroesCon",
    city: "Charlotte",
    state: "North Carolina",
    attendance: 45000,
    date: "06/01/2018",
},
{
    event: "HeroesCon",
    city: "Charlotte",
    state: "North Carolina",
    attendance: 50000,
    date: "06/01/2019",
},
];

function buildDropDoun() {
    //get the dropdown menu from the page
    let dropdownMenu = document.getElementById('eventDropDown')

    //empty the innerHTML to ensure it is clan
    dropdownMenu.innerHTML = "";

    //jet our events
    let currEvents = getEventData();

    //pull out JUST the city name
    let eventCities = currEvents.map((event) => event.city);

    //set is an object that has a constructor of set and only use the distinct values
    //new is how we run the constructor and class
    // filte the cityes to only DISTINCT city names
    let distintCities = [...new Set(eventCities)];

    //get the template from the page
    const template = document.getElementById('dropdownItemTemplate');

    //it represent the copy of the template from HTML
    let dropdownTemplateNode = document.importNode(template.content, true);

    //QuerySelector will take css selector it will take only first selector that match
    let menuItem = dropdownTemplateNode.querySelector('a');
    //changet the content
    menuItem.textContent = "All Cities";
    menuItem.setAttribute("data-string", "All");

    //add item to the page
    dropdownMenu.appendChild(dropdownTemplateNode);

    for (let i = 0; i < distintCities.length; i++) {
        let cityMenuItem = document.importNode(template.content, true);
        let cityButton = cityMenuItem.querySelector('a');

        cityButton.textContent = distintCities[i];
        cityButton.setAttribute("data-string", distintCities[i]);

        dropdownMenu.appendChild(cityMenuItem);
    }
    displayStats(currEvents);
    displayEventData(currEvents);
}

function displayStats(eventsArray) {
    // let totalAttendance = calculateTotal(eventsArray)
    let stats = calculateAverageMostLeast(eventsArray)

    document.getElementById('total').textContent = stats.totalAttendance.toLocaleString(
        "en-US", {
        maximumFractionDigits: 0,
        minimumFractionDigits: 0
    });
    document.getElementById('average').textContent = stats.averageAttendance.toLocaleString();
    document.getElementById('most').textContent = stats.mostAttendance.toLocaleString();
    document.getElementById('least').textContent = stats.leastAttendance.toLocaleString()
}

function calculateAverageMostLeast(eventsArray) {
    let calcResult = {
        totalAttendance: 0,
        averageAttendance: 0,
        mostAttendance: eventsArray[0].attendance,
        leastAttendance: eventsArray[0].attendance
    }

    let sum = 0;

    for (let index = 0; index < eventsArray.length; index++) {
        sum += eventsArray[index].attendance;

        if (calcResult.most < eventsArray[index].attendance) {
            calcResult.mostAttendance = eventsArray[index].attendance;

        } else if (calcResult.least > eventsArray[index].attendance) {
            calcResult.leastAttendance = eventsArray[index].attendance;
        }
    }
    calcResult.totalAttendance = sum;
    calcResult.averageAttendance = sum / eventsArray.length;
    return calcResult;
}

function displayEventData(eventsArray) {

    let tableBody = document.getElementById('eventTableBody')
    const tableRowTemplate = document.getElementById('eventTableRowTemplate')
    tableBody.innerHTML = '';

    for (let i = 0; i < eventsArray.length; i++) {
        let eventRow = document.importNode(tableRowTemplate.content, true)
        let currentEvent = eventsArray[i]
        // eventRow.querySelector('[data-id="event"]')
        let tableCells = eventRow.querySelectorAll('td')

        tableCells[0].textContent = currentEvent.event;
        tableCells[1].textContent = currentEvent.city;
        tableCells[2].textContent = currentEvent.state;
        tableCells[3].textContent = currentEvent.attendance;
        tableCells[4].textContent = currentEvent.date;

        tableBody.appendChild(eventRow);
    }
}
// 
function getEventData() {
    //  localStorage stays in the browser
    // JSON.parse() - deserialization, make a js object out of the string
    let currentEvents = JSON.parse(localStorage.getItem('tr-EventData'));

    if (currentEvents == null) {
        currentEvents = events;
        // JSON.stringify() - serialization , make a string out of the js object 
        localStorage.setItem('tr-EventData', JSON.stringify(currentEvents))
    }

    return currentEvents;
}

function getEvents(element) {
    //get all events what we have
    let currentEvent = getEventData();
    // we click on that element-(city),
    let cityName = element.getAttribute('data-string');

    let fileredEvents = currentEvent;

    if (cityName != 'All') {
        //give me all events in that city
        fileredEvents = currentEvent.filter((event) => {
            if (cityName == event.city) {
                return event;
            }
        })
    }
    // fileredEvents =currentEvent.filter(event => cityName == event.city);
    document.getElementById('statsHeader').textContent = cityName;
    displayStats(fileredEvents);
    displayEventData(fileredEvents);

}

function seveEventData() {
    let eventName = document.getElementById('newEventName').value;
    let cityName = document.getElementById('newEventCity').value;
    let eventAttendance = parseInt(document.getElementById('newEventAttendance').value);
    let eventDate = document.getElementById('newEventDate').value;

    eventDate = `${eventDate} 00:00`;// "2023-01-20 00:00"
    eventDate = new Date(eventDate).toLocaleDateString();

    let stateSelect = document.getElementById('newEventState');
    //option is in array of each element as an object 
    let state = stateSelect.options[stateSelect.selectedIndex].text;

    let newEvent = {
        event: eventName,
        city: cityName,
        state: state,
        attendance: eventAttendance,
        date: eventDate,
    }

    let currentEvent = getEventData();
    currentEvent.push(newEvent)
    localStorage.setItem("tr-EventData", JSON.stringify(currentEvent));

    buildDropDoun();
    document.getElementById('statsHeader').textContent = "All"
    document.getElementById('newEventForm').reset();
}

// newEventName
// newEventCity
// newEventState
// newEventAttendance
// newEventDate

