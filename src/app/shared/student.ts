export class Student {
    _id: String;
    student_name: String;
    student_email: String;
    section: String;
    subjects: Array<string>;
    dob: Date;
    gender: String;

    constructor(_id: String, student_name: String, student_email: String, section: String, subjects: Array<string>, dob: Date, gender: String){
        this._id = _id;
        this.student_name = student_name;
        this.student_email = student_email;
        this.section = section;
        this.subjects = subjects;
        this.dob = dob;
        this.gender = gender;
    }
}
