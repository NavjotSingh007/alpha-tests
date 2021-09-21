require('core-js'); // <- at the top of your entry point
const _ = require('lodash');
const winston = require('winston');

const maxMarks = 50;

const processData = (data) => {
  let finalData = {};

  for (let index = 0; index < data.length; index++) {
    const student = data[index];
    if (!finalData.records) {
      finalData.records = [];
    }

    let record = {
      name: "",
      students: [],
    };
    record.name = student.class;
    let recordIndex = -1;
    for (
      let recordObjIndex = 0;
      recordObjIndex < finalData.records.length;
      recordObjIndex++
    ) {
      const recordObj = finalData.records[recordObjIndex];
      if (record.name == recordObj.name) {
        record = recordObj;
        recordIndex = recordObjIndex;
        break;
      }
    }

    let outputDataStudent = student;
    outputDataStudent.title = student.name.first + " " + student.name.last;
    outputDataStudent.totalMarks = 0;

    let maximumMarkAchieved = 0;
    for (let course of outputDataStudent.marks) {
      if (course.marks > maximumMarkAchieved) {
        maximumMarkAchieved = course.marks;
      }
    }

    outputDataStudent.marks.forEach((course) => {
      if ((course.marks / maximumMarkAchieved) * 100 > 33) {
        outputDataStudent.totalMarks += course.marks;
      }
    });

    record.students.push(outputDataStudent);

    record.students.sort((a, b) => {
      if (a.totalMarks < b.totalMarks) {
        return 1;
      }
      if (a.totalMarks > b.totalMarks) {
        return -1;
      }
      return 0;
    });

    if (recordIndex == -1) {
      finalData.records.push(record);
    } else {
      finalData.records[recordIndex] = record;
    }

    if (!finalData.top) {
      finalData.top = [];
    }
    let top = `${outputDataStudent.title} from ${record.name} obtained ${outputDataStudent.totalMarks}`;
    finalData.top.push(top);
  }

  finalData.top.sort((a, b) => {
    let aMarks = Number(a.split("obtained ")[1]);
    let bMarks = Number(b.split("obtained ")[1]);

    if (aMarks < bMarks) {
      return 1;
    }
    if (aMarks > bMarks) {
      return -1;
    }
    return 0;
  });

  return finalData;
}

module.exports = {
  processData
}
