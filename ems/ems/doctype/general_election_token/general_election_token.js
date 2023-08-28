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
     refresh: function(frm) {
        if (frm.doc.photo) {
            // Image field has a value, display the image
            frm.fields_dict['photo_display'].$wrapper.html(
                `<img src="${frm.doc.photo}" alt="Image">`
            );
        } else {
            // Clear the HTML field content when no image is present
            frm.fields_dict['photo_display'].$wrapper.empty();
        }
    }
});
