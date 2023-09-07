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
            WHERE card_no = %s
        """
    attendance_result = frappe.db.sql(attendance, (args.get('card_no'),), as_dict=True)
    if not attendance_result:
        sql_query = """
            SELECT member_no, member_name, father_husband,
                   grand_father_name, khundi, photo, booth, page, vote_no,cnic
            FROM `tabActive Voter List`
            WHERE name = %s
        """
        results = frappe.db.sql(sql_query, (args.get('card_no'),), as_dict=True)
        return results
    elif attendance_result and attendance_result[0].attendance == 0:
        doc = frappe.get_all("General Election Token", filters={'card_no': args.get('card_no')}, pluck="name")
        if doc:
            return [{'cn':doc[0]}]
        else:
            return None
    else:
        return attendance_result



