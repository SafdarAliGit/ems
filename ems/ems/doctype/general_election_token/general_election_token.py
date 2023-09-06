# Copyright (c) 2023, Tech Ventures and contributors
# For license information, please see license.txt
import frappe
# import frappe
from frappe.model.document import Document


class GeneralElectionToken(Document):
    def before_save(self):
        self.date_time = frappe.utils.now_datetime()


@frappe.whitelist()
def get_active_voter_details(**args):
    attendance = """
            SELECT attendance,date_time,owner,card_no
            FROM `tabGeneral Election Token`
            WHERE attendance = 1 AND card_no = %s
        """
    attendance_result = frappe.db.sql(attendance, (args.get('card_no'),), as_dict=True)
    if not attendance_result:
        sql_query = """
            SELECT member_no, member_name, father_husband,
                   grand_father_name, khundi, photo, booth, page, vote_no
            FROM `tabActive Voter List`
            WHERE name = %s
        """
        results = frappe.db.sql(sql_query, (args.get('card_no'),), as_dict=True)
        return results
    else:
        return attendance_result



