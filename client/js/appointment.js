var appointmentData = [
    {
        "title": "My First Appointment",
        "description": "Serious business to attend to",
        "startTime": "2016-02-22T13:30:00.000Z",
        "endTime": "2016-02-22T14:30:00.000Z"
    },
    {
        "title": "My Second Appointment",
        "description": "Popor fuifu dbhgatyd",
        "startTime": "2016-03-05T18:15:00.000Z",
        "endTime": "2016-03-05T20:00:00.000Z"
    },
    {
        "title": "My Third Appointment",
        "description": "Amk jk uh uyyyds",
        "startTime": "2016-05-10T08:30:00.000Z",
        "endTime": "2016-05-10T09:30:00.000Z"
    },
    {
        "title": "My Fourth Appointment",
        "description": "Popor fuifu dbhgatyd",
        "startTime": "2016-07-01T13:15:00.000Z",
        "endTime": "2016-07-01T14:15:00.000Z"
    },
    {
        "title": "My Fifth Appointment",
        "description": "Amk jk uh uyyyds",
        "startTime": "2016-08-18T10:30:00.000Z",
        "endTime": "2016-08-18T11:30:00.000Z"
    }
];

// var appointmentData = [
//     {
//         "title": "My First Appointment",
//         "description": "Serious business to attend to",
//         "startTime": "2016-02-22T13:30:00.000Z",
//         "endTime": "2016-02-22T14:30:00.000Z"
//     }
// ];

(function () {
    sessionStorage.clear();
    sessionStorage.setItem('data', JSON.stringify(appointmentData));
})();
// **************** One time only *********************************

var entryDataCache = null;
var $entryDialogContainer = function() {
    return $('#entryDialogContainer');
}

function getAppointmentsData() {

    var data = sessionStorage.getItem('data');
    if (data === null) {
        console.log('No such key in sessionStorage');
        return;
    }

    try {
        data = JSON.parse(sessionStorage.getItem('data'));
    } catch (err) {
        console.log('Invalid JSON data in sessionStorage.' + err);
        return;
    }

    return data;
}


function updateAppointmentsData(entryId) {

    if (entryId !== 'newEntry') {
        appointmentData.splice(entryId, 1);
    }

    if (entryDataCache !== null) {
        appointmentData.push(entryDataCache);
    }

    appointmentData = appointmentData.sort(function (a, b) {
        if (a.startTime < b.startTime) return -1;
        if (a.startTime > b.startTime) return 1;
        return 0;
    });

    sessionStorage.setItem('data', JSON.stringify(appointmentData));
    entryDataCache = null;
    listAppointments();
}


// *************************** VIEW ***********************************

var EDIT_ENTRY_DIALOG = `
<div class="col-md-12" id="entryDialogContainer" data-entry-id="newEntry" style="display:none">
    <div class="panel panel-default">
        <div class="panel-heading">
            <h3 class="panel-title"></h3>
        </div>
        <div class="panel-body">
            <div class="row">
                <div class='col-md-3'>
                    <input class="form-control" type="text" name="title" placeholder="Title*" required>
                </div>
                <div class='col-md-3'>
                    <input class="form-control" type="text" name="description" placeholder="Description">
                </div>
                <div class='col-md-2'>
                    <input type='text' class="form-control datetime" name="startTime" id='startTime' placeholder="Start Date/Time*" required/>
                </div>
                <div class='col-md-2'>                            
                    <input type='text' class="form-control datetime" name="endTime" id='endTime' disabled="disabled" placeholder="End Date/Time" />     
                </div>
                <div class="col-md-12 appt-btn-ctn">
                    <button class="btn btn-default" id="cancelApptEntry">Cancel</button>
                    <button class="btn btn-primary" id="saveApptEntry">Save</button>
                </div>
            </div>
        </div>
    </div>                        
</div>`;

var DELETE_ENTRY_DIALOG = `
<div class="row delete-entry-dialog" id="entryDialogContainer" data-entry-id style="display:none">
    <div class="col-md-6 col-md-offset-3">
        <div class="panel panel-default">
            <div class="panel-heading">
                <h3 class="panel-title">Delete appointment</h3>
            </div>
            <div class="panel-body">
                <div class="row">
                    <div class="col-md-12 appt-btn-ctn appt-btn-ctn--delete">
                        <p>Are you sure you want to delete <strong><span></span></strong>?</p>
                        <button class="btn btn-default" id="cancelApptDelete">Cancel</button>
                        <button class="btn btn-danger" id="confirmApptDelete">Delete</button>
                    </div>
                </div>
            </div>
        </div>                        
    </div>
</div>`;

var NO_ENTRIES_CTN = `
<div class="row no-appt">
    <div class="col-md-6 col-md-offset-3">
        <div class="panel panel-default">
            <div class="panel-body">
                <p>No appointments here</p>
            </div>
        </div>                        
    </div>
</div>`;


function listAppointments() {

    $appointmentsContainer.empty();
    appointmentData = getAppointmentsData();

    if (appointmentData.length === 0) {
        $apptHeaderContainer.hide();
        $appointmentsContainer.append(NO_ENTRIES_CTN);
        return;
    }

    var html = '';

    appointmentData.forEach(function (appointment, index) {

        var startTime = moment(appointment.startTime).format("ddd, MMM Do YYYY, h:mm a");
        var endTime = moment(appointment.endTime).format("ddd, MMM Do YYYY, h:mm a");

        var entryRow = `
        <div class="row row--appt-entry" data-entry-id="${index}">
            <div class='col-md-3'>
                <span name="title">${appointment.title}</span>
            </div>
            <div class='col-md-3'>
                <span name="description">${appointment.description}</span>
            </div>
            <div class='col-md-2'>
                <span name="startTime">${startTime}</span>
            </div>
            <div class='col-md-2'>
                <span name="endTime">${endTime}</span>
            </div>
            <div class='col-md-2 text-right'>
                <i class="editApptEntry material-icons" data-entry-id="${index}">mode_edit</i>`+
                `<i class="deleteApptEntry material-icons" data-entry-id="${index}">delete_forever</i>
            </div>
        </div>`;

        html += entryRow;
    });

    $apptHeaderContainer.show();
    $appointmentsContainer.append(html);

    $('.editApptEntry').click(function (e) {
        editEntry(e);
    });

    $('.deleteApptEntry').click(function (e) {
        deleteEntry(e);
    });
}


function initDialogContainer(entryId) {

    entryDataCache = null;
    initDateTimePicker();
    var $entryDialogContainer = $("#entryDialogContainer");

    $("#saveApptEntry").click(function () {
        saveEntry();
    });

    $("#cancelApptEntry").click(function () {
        removeDialogContainer();
    });

    if (entryId === 'newEntry') {
        $('.panel-title', $entryDialogContainer).text('New appointment');
    } else {
        $('.panel-title', $entryDialogContainer).text('Edit appointment');
        $entryDialogContainer.wrap('<div class="row"></div>').addClass('row--appt-entry-dialog');
    }

    $entryDialogContainer.slideToggle();
}

function createEntry() {

    if (dialogExists() && isNewEntry()) {
        return;
    }

    if (dialogExists() && !isNewEntry()) {
        removeDialogContainer(callback);
        return;
    }

    function callback() {
        $('.no-appt').remove();
        $apptMenuContainer.after(EDIT_ENTRY_DIALOG);
        initDialogContainer('newEntry');
    }

    callback();
}

function isValidEntry(requiredFields) {

    var isValid = true;

    requiredFields.each(function () {
        var reqInput = $(this);
        if (reqInput.val().length === 0) {
            isValid = false;
            reqInput.parent().addClass('has-warning');
            reqInput.focusout(function () {
                if (reqInput.val().length !== 0) {
                    reqInput.parent().removeClass('has-warning');
                }
            });
        }
    });
    return isValid;
}

function saveEntry() {

    var $entryDialogContainer = $('#entryDialogContainer');
    var inputFields = $('input', $entryDialogContainer);
    var requiredFields = inputFields.filter('input[required]');

    if (!isValidEntry(requiredFields)) {
        return;
    }

    entryDataCache = {};

    inputFields.each(function () {

        var input = $(this);
        var key = input.attr('name');

        if (input.hasClass('datetime')) {
            entryDataCache[key] = input.data("DateTimePicker").date()._d.toISOString();
            return;
        }
        entryDataCache[key] = input.val();
    });

    $entryDialogContainer.slideToggle('fast', function () {

        var entryId = $entryDialogContainer.attr('data-entry-id');
        $entryDialogContainer.remove();
        updateAppointmentsData(entryId);
    });
}

function editEntry(e) {

    removeDialogContainer(callback);

    function callback() {

        var entryId = getEntryId(e);
        var $apptEntryRow = getEntryRow(e);
        $apptEntryRow.after(EDIT_ENTRY_DIALOG);

        var $entryDialogContainer = $('#entryDialogContainer');
        $entryDialogContainer.attr('data-entry-id', entryId);

        $('input', $entryDialogContainer).each(function () {
            var input = $(this);
            var value = $apptEntryRow.find('span[name="' + input.attr('name') + '"]').text();
            input.val(value);
        });

        $apptEntryRow.remove();
        initDialogContainer(entryId);
    }
}


function initApptDeleteDialog(e) {

    $("#confirmApptDelete").click(function () {
        deleteEntryConfirmed(e);
    });

    $("#cancelApptDelete").click(function () {
        removeDialogContainer();
    });

    $entryDialogContainer = $('#entryDialogContainer');
    $entryDialogContainer.attr('data-entry-id', getEntryId(e));
    $entryDialogContainer.next().addClass('below-delete');
    $entryDialogContainer.slideToggle('fast');
}

function deleteEntry(e) {

    removeDialogContainer(callback);

    function callback() {

        var entryId = getEntryId(e);
        var $apptEntryRow = getEntryRow(e);
        var apptTitle = $('[name="title"]', $apptEntryRow).text();

        $apptEntryRow.after(DELETE_ENTRY_DIALOG);
        $('#entryDialogContainer').find('span').text(apptTitle);
        $apptEntryRow.remove();
        initApptDeleteDialog(e);
    }
}

function deleteEntryConfirmed(e) {

    $('#entryDialogContainer').slideToggle('fast', function () {
        updateAppointmentsData(getEntryId(e));
    });
}

function removeDialogContainer(callback) {

    var dialogSelector = $('#entryDialogContainer');

    if (dialogSelector.length !== 0) {
        dialogSelector.slideToggle("fast", function () {
            $(this).remove();
            listAppointments();
            if (typeof callback === 'function') {
                callback();
            }
        });
    } else {
        if (typeof callback === 'function') {
            callback();
        }
    }
}

function getEntryId(e) {
    return ($(e.target).data('entry-id'));
}

function getEntryRow(e) {
    var entryId = $(e.target).data('entry-id');
    return ($('.row--appt-entry[data-entry-id="' + entryId + '"]'));
}

function dialogExists() {
    return (Boolean($('#entryDialogContainer').length));
}

function isNewEntry() {
    return ($('#entryDialogContainer').data('entry-id') === 'newEntry');
}

function initDateTimePicker() {

    $('.datetime').datetimepicker({
        format: "ddd, MMM Do YYYY, h:mm a"
    });

    var $startTime = $("#startTime");
    var $endTime = $("#endTime");

    $startTime.on("dp.hide", function (e) {
        if (e.target.value.length !== 0) {

            $endTime.removeAttr('disabled');
            $endTime.datetimepicker({
                useCurrent: false
            });
            $endTime.data("DateTimePicker").minDate(e.date);
            $endTime.data("DateTimePicker").date(e.date);
            $endTime.trigger("focus");
        }
    });

    $startTime.on("dp.change", function (e) {
        if ($endTime.attr('disabled') !== 'disabled') {
            $endTime.data("DateTimePicker").date(null);
        }
    });
}

// *********************** DOCUMENT READY ***********************

$(document).ready(function () {
    
    $apptMenuContainer= $('#apptMenuContainer');
    $apptHeaderContainer = $('#apptHeaderContainer');
    $appointmentsContainer = $('#apptContainer');

    listAppointments();

    $('#create-new-appointment').click(function () {
        createEntry();
    });
});