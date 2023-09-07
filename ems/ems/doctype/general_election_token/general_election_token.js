// Copyright (c) 2023, Tech Ventures and contributors
// For license information, please see license.txt
// Disable F12 key
document.addEventListener("keydown", function(e) {
    if (e.keyCode == 123) {
        e.preventDefault();
    }
});

// Disable context menu
document.addEventListener("contextmenu", function(e) {
    e.preventDefault();
});
frappe.ui.form.on('General Election Token', {

    // card_no: function (frm) {
    //
    //
    // },
    refresh: function (frm) {

        if (frm.doc.photo) {
            // Image field has a value, display the image
            frm.fields_dict['photo_display'].$wrapper.html(
                `<img src="${frm.doc.photo}" alt="Image">`
            );
        } else {
            // Clear the HTML field content when no image is present
            frm.fields_dict['photo_display'].$wrapper.empty();
        }
        // print button


        frm.add_custom_button(__('Open Print Format'), function () {
            if (frm.doc.attendance === 0 && frm.doc.docstatus === 0) {
                // attendance upate
                frm.doc.attendance = 1;
                frm.refresh_field('attendance');
                frappe.call({
                    method: 'frappe.client.submit',
                    args: {
                        doc: frm.doc
                    },
                    callback: function (response) {
                        if (response && response.message) {
                            frm.reload_doc();
                            var print_format = 'Ticket'; // Replace with the actual print format name
                            openPrintFormat(frm.docname, print_format);
                            var new_doc = frappe.model.get_new_doc('General Election Token');
                            frappe.set_route('Form', 'General Election Token', new_doc.name);

                        }
                    }
                });
            } else {
                frappe.throw("Ticket Already Printed");
            }

        });

// end attendance upate

        function openPrintFormat(docname, print_format) {
            var print_url = frappe.urllib.get_full_url(
                '/printview?doctype=' + encodeURIComponent('General Election Token')
                + '&name=' + encodeURIComponent(docname)
                + '&format=' + encodeURIComponent(print_format)
            );

            var width = 800;
            var height = 600;

            var left = (window.screen.width - width) / 2;
            var top = (window.screen.height - height) / 2;

            var popupWindow = window.open('', '_blank', 'width=' + width + ',height=' + height + ',top=' + top + ',left=' + left);
            popupWindow.document.write('<iframe src="' + print_url + '" width="100%" height="100%" frameborder="0"></iframe>');
            popupWindow.focus();
        }

        // print button end


        frm.fields_dict.card_no.$input.on('keydown', function (e) {
            // Check if the key pressed is Enter (key code 13)
            if (e.which === 13) {
                e.preventDefault(); // Prevent the default form submission
                if (frm.doc.card_no) {
                    frappe.call({
                        method: "ems.ems.doctype.general_election_token.general_election_token.get_active_voter_details",
                        args: {
                            card_no: frm.doc.card_no
                        },
                        callback: function (response) {
                            var voter_details = response.message;

                            function remove_table() {
                                var elementToRemove = document.getElementById("responseTable");
                                if (elementToRemove) {
                                    elementToRemove.parentNode.removeChild(elementToRemove);
                                }
                            }

                            if (voter_details) {

                                if (voter_details[0].attendance) {

                                    function createTableHTML(data) {
                                        frm.set_value('photo', data[0].photo)
                                        var tableHTML = `<table class="table table-bordered" style="font-weight: bold;font-size: 18px;"><tbody>`;
                                        tableHTML += `
                                <tr>
                                    <td style="font-weight: bolder;color:red;">Note: Ticket Already Printed</td>
                                    
                                </tr>
                                <tr>
                                    <td>By User</td>
                                    <td>${voter_details[0].owner}</td>
                                </tr>
                                <tr>
                                    <td>Card No</td>
                                    <td>${voter_details[0].card_no}</td>
                                </tr>
                                <tr>
                                    <td> At Date Time</td>
                                    <td>${voter_details[0].date_time}</td>
                                </tr>`;


                                        tableHTML += `</tbody></table>`;

                                        return tableHTML;
                                    }


                                    var formSectionDiv = document.querySelector('.form-section');
                                    var existingResponseTable = formSectionDiv.nextElementSibling;
                                    var elementToRemove = document.getElementById("responseTable");
                                    if (elementToRemove) {
                                        elementToRemove.parentNode.removeChild(elementToRemove);
                                    }

                                    var responseTableHTML = createTableHTML(voter_details);
                                    var tempElement = document.createElement('div');
                                    tempElement.id = 'responseTable';
                                    tempElement.innerHTML = responseTableHTML;
                                    formSectionDiv.insertAdjacentElement('afterend', tempElement);

                                    var new_doc = frappe.model.get_new_doc('General Election Token');
                                    frappe.set_route('Form', 'General Election Token', new_doc.name);


                                } else if (voter_details[0].cn) {
                                    var doc = frappe.model.get_doc('General Election Token', voter_details[0].cn);
                                    frappe.set_route('Form', 'General Election Token', doc.name);

                                } else {

                                    frm.set_value('photo', voter_details[0].photo);
                                    frm.set_value('member_no', voter_details[0].member_no);
                                    frm.set_value('member_name', voter_details[0].member_name);
                                    frm.set_value('father_husband', voter_details[0].father_husband);
                                    frm.set_value('grand_father_name', voter_details[0].grand_father_name);
                                    frm.set_value('khundi', voter_details[0].khundi);
                                    frm.set_value('booth', voter_details[0].booth);
                                    frm.set_value('page', voter_details[0].page);
                                    frm.set_value('vote_no', voter_details[0].vote_no);
                                    frm.set_value('cnic', voter_details[0].cnic);
                                    frm.set_value('attendance', voter_details[0].attendance | 0);

                                    frm.fields_dict['photo_display'].$wrapper.html(
                                        `<img src="${voter_details[0].photo}" alt="Image">`
                                    );
                                    setTimeout(remove_table, 500);
                                }


                            } else {
                                frappe.throw(`No voter details found under card no: ${frm.doc.card_no} .`);
                            }
                        }
                    });
                }
            }
        });

    }


});
