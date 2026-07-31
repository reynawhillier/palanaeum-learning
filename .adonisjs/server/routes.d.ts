import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'drive.fs.serve': { paramsTuple: [...ParamValue[]]; params: {'*': ParamValue[]} }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'new_account.store': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'session.store': { paramsTuple?: []; params?: {} }
    'reports.performance.print': { paramsTuple: [ParamValue]; params: {'courseId': ParamValue} }
    'reports.performance': { paramsTuple: [ParamValue]; params: {'courseId': ParamValue} }
    'reports.performance.generate.get': { paramsTuple: [ParamValue]; params: {'courseId': ParamValue} }
    'dashboard': { paramsTuple?: []; params?: {} }
    'profile': { paramsTuple?: []; params?: {} }
    'session.destroy': { paramsTuple?: []; params?: {} }
    'profile.update': { paramsTuple?: []; params?: {} }
    'reports.performance.generate': { paramsTuple: [ParamValue]; params: {'courseId': ParamValue} }
    'home': { paramsTuple?: []; params?: {} }
    'upload.store': { paramsTuple?: []; params?: {} }
    'course_content.topics.create': { paramsTuple: [ParamValue]; params: {'courseId': ParamValue} }
    'course_content.topics.store': { paramsTuple: [ParamValue]; params: {'courseId': ParamValue} }
    'course_content.items.create': { paramsTuple: [ParamValue,ParamValue]; params: {'courseId': ParamValue,'topicId': ParamValue} }
    'course_content.items.store': { paramsTuple: [ParamValue,ParamValue]; params: {'courseId': ParamValue,'topicId': ParamValue} }
    'course_content.topics.destroy': { paramsTuple: [ParamValue,ParamValue]; params: {'courseId': ParamValue,'topicId': ParamValue} }
    'course_content.items.destroy': { paramsTuple: [ParamValue,ParamValue,ParamValue]; params: {'courseId': ParamValue,'topicId': ParamValue,'itemId': ParamValue} }
    'courses.content': { paramsTuple: [ParamValue]; params: {'courseId': ParamValue} }
    'course_content.topics.show': { paramsTuple: [ParamValue,ParamValue]; params: {'courseId': ParamValue,'topicId': ParamValue} }
    'course_content.items.file': { paramsTuple: [ParamValue,ParamValue]; params: {'courseId': ParamValue,'itemId': ParamValue} }
    'assignments.create': { paramsTuple: [ParamValue]; params: {'courseId': ParamValue} }
    'assignments.store': { paramsTuple: [ParamValue]; params: {'courseId': ParamValue} }
    'assignments.edit': { paramsTuple: [ParamValue,ParamValue]; params: {'courseId': ParamValue,'assignmentId': ParamValue} }
    'assignments.update': { paramsTuple: [ParamValue,ParamValue]; params: {'courseId': ParamValue,'assignmentId': ParamValue} }
    'assignments.destroy': { paramsTuple: [ParamValue,ParamValue]; params: {'courseId': ParamValue,'assignmentId': ParamValue} }
    'assignments.grade.edit': { paramsTuple: [ParamValue,ParamValue,ParamValue]; params: {'courseId': ParamValue,'assignmentId': ParamValue,'submissionId': ParamValue} }
    'assignments.grade.store': { paramsTuple: [ParamValue,ParamValue,ParamValue]; params: {'courseId': ParamValue,'assignmentId': ParamValue,'submissionId': ParamValue} }
    'assignments.grade.destroy': { paramsTuple: [ParamValue,ParamValue,ParamValue]; params: {'courseId': ParamValue,'assignmentId': ParamValue,'submissionId': ParamValue} }
    'courses.assignments': { paramsTuple: [ParamValue]; params: {'courseId': ParamValue} }
    'assignments.show': { paramsTuple: [ParamValue,ParamValue]; params: {'courseId': ParamValue,'assignmentId': ParamValue} }
    'assignments.file': { paramsTuple: [ParamValue,ParamValue,ParamValue]; params: {'courseId': ParamValue,'assignmentId': ParamValue,'submissionId': ParamValue} }
    'assignments.submit': { paramsTuple: [ParamValue,ParamValue]; params: {'courseId': ParamValue,'assignmentId': ParamValue} }
    'courses.create': { paramsTuple?: []; params?: {} }
    'courses.store': { paramsTuple?: []; params?: {} }
    'courses.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'courses.students': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'courses.grades': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'courses.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.users': { paramsTuple?: []; params?: {} }
    'admin.users.change_role.form': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.users.change_role': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'courses.enroll': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'courses.unenroll': { paramsTuple: [ParamValue,ParamValue]; params: {'id': ParamValue,'studentId': ParamValue} }
    'students.index': { paramsTuple?: []; params?: {} }
    'students.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'students.enroll': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  GET: {
    'drive.fs.serve': { paramsTuple: [...ParamValue[]]; params: {'*': ParamValue[]} }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'reports.performance.print': { paramsTuple: [ParamValue]; params: {'courseId': ParamValue} }
    'reports.performance': { paramsTuple: [ParamValue]; params: {'courseId': ParamValue} }
    'reports.performance.generate.get': { paramsTuple: [ParamValue]; params: {'courseId': ParamValue} }
    'dashboard': { paramsTuple?: []; params?: {} }
    'profile': { paramsTuple?: []; params?: {} }
    'home': { paramsTuple?: []; params?: {} }
    'course_content.topics.create': { paramsTuple: [ParamValue]; params: {'courseId': ParamValue} }
    'course_content.items.create': { paramsTuple: [ParamValue,ParamValue]; params: {'courseId': ParamValue,'topicId': ParamValue} }
    'courses.content': { paramsTuple: [ParamValue]; params: {'courseId': ParamValue} }
    'course_content.topics.show': { paramsTuple: [ParamValue,ParamValue]; params: {'courseId': ParamValue,'topicId': ParamValue} }
    'course_content.items.file': { paramsTuple: [ParamValue,ParamValue]; params: {'courseId': ParamValue,'itemId': ParamValue} }
    'assignments.create': { paramsTuple: [ParamValue]; params: {'courseId': ParamValue} }
    'assignments.edit': { paramsTuple: [ParamValue,ParamValue]; params: {'courseId': ParamValue,'assignmentId': ParamValue} }
    'assignments.grade.edit': { paramsTuple: [ParamValue,ParamValue,ParamValue]; params: {'courseId': ParamValue,'assignmentId': ParamValue,'submissionId': ParamValue} }
    'courses.assignments': { paramsTuple: [ParamValue]; params: {'courseId': ParamValue} }
    'assignments.show': { paramsTuple: [ParamValue,ParamValue]; params: {'courseId': ParamValue,'assignmentId': ParamValue} }
    'assignments.file': { paramsTuple: [ParamValue,ParamValue,ParamValue]; params: {'courseId': ParamValue,'assignmentId': ParamValue,'submissionId': ParamValue} }
    'courses.create': { paramsTuple?: []; params?: {} }
    'courses.students': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'courses.grades': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'courses.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.users': { paramsTuple?: []; params?: {} }
    'admin.users.change_role.form': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'students.index': { paramsTuple?: []; params?: {} }
    'students.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  HEAD: {
    'drive.fs.serve': { paramsTuple: [...ParamValue[]]; params: {'*': ParamValue[]} }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'reports.performance.print': { paramsTuple: [ParamValue]; params: {'courseId': ParamValue} }
    'reports.performance': { paramsTuple: [ParamValue]; params: {'courseId': ParamValue} }
    'reports.performance.generate.get': { paramsTuple: [ParamValue]; params: {'courseId': ParamValue} }
    'dashboard': { paramsTuple?: []; params?: {} }
    'profile': { paramsTuple?: []; params?: {} }
    'home': { paramsTuple?: []; params?: {} }
    'course_content.topics.create': { paramsTuple: [ParamValue]; params: {'courseId': ParamValue} }
    'course_content.items.create': { paramsTuple: [ParamValue,ParamValue]; params: {'courseId': ParamValue,'topicId': ParamValue} }
    'courses.content': { paramsTuple: [ParamValue]; params: {'courseId': ParamValue} }
    'course_content.topics.show': { paramsTuple: [ParamValue,ParamValue]; params: {'courseId': ParamValue,'topicId': ParamValue} }
    'course_content.items.file': { paramsTuple: [ParamValue,ParamValue]; params: {'courseId': ParamValue,'itemId': ParamValue} }
    'assignments.create': { paramsTuple: [ParamValue]; params: {'courseId': ParamValue} }
    'assignments.edit': { paramsTuple: [ParamValue,ParamValue]; params: {'courseId': ParamValue,'assignmentId': ParamValue} }
    'assignments.grade.edit': { paramsTuple: [ParamValue,ParamValue,ParamValue]; params: {'courseId': ParamValue,'assignmentId': ParamValue,'submissionId': ParamValue} }
    'courses.assignments': { paramsTuple: [ParamValue]; params: {'courseId': ParamValue} }
    'assignments.show': { paramsTuple: [ParamValue,ParamValue]; params: {'courseId': ParamValue,'assignmentId': ParamValue} }
    'assignments.file': { paramsTuple: [ParamValue,ParamValue,ParamValue]; params: {'courseId': ParamValue,'assignmentId': ParamValue,'submissionId': ParamValue} }
    'courses.create': { paramsTuple?: []; params?: {} }
    'courses.students': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'courses.grades': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'courses.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.users': { paramsTuple?: []; params?: {} }
    'admin.users.change_role.form': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'students.index': { paramsTuple?: []; params?: {} }
    'students.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  POST: {
    'new_account.store': { paramsTuple?: []; params?: {} }
    'session.store': { paramsTuple?: []; params?: {} }
    'session.destroy': { paramsTuple?: []; params?: {} }
    'profile.update': { paramsTuple?: []; params?: {} }
    'reports.performance.generate': { paramsTuple: [ParamValue]; params: {'courseId': ParamValue} }
    'upload.store': { paramsTuple?: []; params?: {} }
    'course_content.topics.store': { paramsTuple: [ParamValue]; params: {'courseId': ParamValue} }
    'course_content.items.store': { paramsTuple: [ParamValue,ParamValue]; params: {'courseId': ParamValue,'topicId': ParamValue} }
    'course_content.topics.destroy': { paramsTuple: [ParamValue,ParamValue]; params: {'courseId': ParamValue,'topicId': ParamValue} }
    'course_content.items.destroy': { paramsTuple: [ParamValue,ParamValue,ParamValue]; params: {'courseId': ParamValue,'topicId': ParamValue,'itemId': ParamValue} }
    'assignments.store': { paramsTuple: [ParamValue]; params: {'courseId': ParamValue} }
    'assignments.update': { paramsTuple: [ParamValue,ParamValue]; params: {'courseId': ParamValue,'assignmentId': ParamValue} }
    'assignments.destroy': { paramsTuple: [ParamValue,ParamValue]; params: {'courseId': ParamValue,'assignmentId': ParamValue} }
    'assignments.grade.store': { paramsTuple: [ParamValue,ParamValue,ParamValue]; params: {'courseId': ParamValue,'assignmentId': ParamValue,'submissionId': ParamValue} }
    'assignments.grade.destroy': { paramsTuple: [ParamValue,ParamValue,ParamValue]; params: {'courseId': ParamValue,'assignmentId': ParamValue,'submissionId': ParamValue} }
    'assignments.submit': { paramsTuple: [ParamValue,ParamValue]; params: {'courseId': ParamValue,'assignmentId': ParamValue} }
    'courses.store': { paramsTuple?: []; params?: {} }
    'courses.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.users.change_role': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'courses.enroll': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'courses.unenroll': { paramsTuple: [ParamValue,ParamValue]; params: {'id': ParamValue,'studentId': ParamValue} }
    'students.enroll': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}