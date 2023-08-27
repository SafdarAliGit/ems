// Copyright (c) 2023, Tech Ventures and contributors
// For license information, please see license.txt

frappe.ui.form.on('General Election Token', {
    card_no: function (frm) {
        frappe.call({
            method: "ems.ems.doctype.general_election_token.general_election_token.get_active_voter_details",
            args: {
                card_no: frm.doc.card_no
            },
            callback: function (response) {
                var voter_details = response.message;
                if (voter_details && voter_details.length > 0) {

                function createTableHTML(data) {
                    var tableHTML = `
        <table class="table table-bordered">
        
            <tbody>
    `;


                    tableHTML += `
            <tr>
                <td>Photo</td>
                <td><img src="${data[0].photo}" alt="" style="width: 200px;height: 250px;"></td>
            </tr>
            <tr>
                <td>Member Name</td>
                <td>${data[0].member_name}</td>
            </tr>
            <tr>
                <td>Card No</td>
                <td>${data[0].card_no}</td>
            </tr>
            <tr>
                <td>Member No</td>
                <td>${data[0].member_no}</td>
            </tr>
             <tr>
                <td>Father's Name</td>
                <td>${data[0].father_husband}</td>
            </tr> 
            <tr>
                <td>Grand Father's Name</td>
                <td>${data[0].grand_father_name}</td>
            </tr>
            <tr>
                <td>Khundi-Group</td>
                <td>${data[0].khundi}</td>
            </tr>
            <tr>
                <td>Booth</td>
                <td>${data[0].booth}</td>
            </tr> 
            <tr>
                <td>Page</td>
                <td>${data[0].page}</td>
            </tr>
            <tr>
                <td>Vote No</td>
                <td>${data[0].vote_no}</td>
            </tr>
        `;


                    tableHTML += `
            </tbody>
        </table>
    `;

                    return tableHTML;
                }


                var formSectionDiv = document.querySelector('.form-section');
                var existingResponseTable = formSectionDiv.nextElementSibling;
                if (existingResponseTable && existingResponseTable.id === 'responseTable') {
                    existingResponseTable.remove();
                }

                var responseTableHTML = createTableHTML(voter_details);
                var tempElement = document.createElement('div');
                tempElement.id = 'responseTable';
                tempElement.innerHTML = responseTableHTML;
                formSectionDiv.insertAdjacentElement('afterend', tempElement);


                } else {
                    frappe.throw(`No voter details found under card no: ${frm.doc.card_no} .`);
                }
            }
        });
    }

});
