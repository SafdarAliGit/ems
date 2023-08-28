// Copyright (c) 2023, Tech Ventures and contributors
// For license information, please see license.txt

frappe.ui.form.on('General Election Token', {
    card_no: function (frm) {

        if (frm.doc.card_no) {
            frappe.call({
                method: "ems.ems.doctype.general_election_token.general_election_token.get_active_voter_details",
                args: {
                    card_no: frm.doc.card_no
                },
                callback: function (response) {
                    var voter_details = response.message;

                    if (voter_details && voter_details.length > 0) {


                        frm.set_value('photo', voter_details[0].photo);
                        frm.set_value('member_no', voter_details[0].member_no);
                        frm.set_value('member_name', voter_details[0].member_name);
                        frm.set_value('father_husband', voter_details[0].father_husband);
                        frm.set_value('grand_father_name', voter_details[0].grand_father_name);
                        frm.set_value('khundi', voter_details[0].khundi);
                        frm.set_value('booth', voter_details[0].booth);
                        frm.set_value('page', voter_details[0].page);
                        frm.set_value('vote_no', voter_details[0].vote_no);
                        frm.set_value('attendance', voter_details[0].attendance);

                        frm.fields_dict['photo_display'].$wrapper.html(
                            `<img src="${voter_details[0].photo}" alt="Image">`
                        );

                    } else {
                        frappe.throw(`No voter details found under card no: ${frm.doc.card_no} .`);
                    }
                }
            });
        }
    },
    refresh: function (frm) {
        // remove standard flex buttons
        // var divToRemove = document.querySelector('.standard-actions.flex');
        // if (divToRemove) {
        //     divToRemove.remove();
        // }

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
   if (frm.doc.attendance === 0 && frm.doc.docstatus===0) {
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
                            // var divToRemove = document.querySelector('.standard-actions.flex');
                            // if (divToRemove) {
                            //     divToRemove.remove();
                            // }
                            var print_format = 'Ticket'; // Replace with the actual print format name
                            openPrintFormat(frm.docname, print_format);
                            var new_doc = frappe.model.get_new_doc('General Election Token');
                            frappe.set_route('Form', 'General Election Token', new_doc.name);

                        }
                    }
                });
    }else {
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
    }


});
