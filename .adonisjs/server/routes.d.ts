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
    'session.destroy': { paramsTuple?: []; params?: {} }
    'dashboard': { paramsTuple?: []; params?: {} }
    'profile': { paramsTuple?: []; params?: {} }
    'profile.update': { paramsTuple?: []; params?: {} }
    'reports.performance.generate': { paramsTuple: [ParamValue]; params: {'courseId': ParamValue} }
    'user_lists.index': { paramsTuple?: []; params?: {} }
    'submissions.form': { paramsTuple?: []; params?: {} }
    'submissions.validate': { paramsTuple?: []; params?: {} }
    'submissions.create': { paramsTuple: [ParamValue, ParamValue]; params: { courseId: ParamValue; assignmentId: ParamValue } }
    'submissions.store': { paramsTuple: [ParamValue, ParamValue]; params: { courseId: ParamValue; assignmentId: ParamValue } }
    'submissions.file': { paramsTuple: [ParamValue, ParamValue]; params: { courseId: ParamValue; assignmentId: ParamValue } }
    'courses.assignments': { paramsTuple: [ParamValue]; params: { courseId: ParamValue } }
    'student_lists.index': { paramsTuple?: []; params?: {} }
    'home': { paramsTuple?: []; params?: {} }
    'upload.store': { paramsTuple?: []; params?: {} }
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
    'courses.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'courses.grades': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
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
    'user_lists.index': { paramsTuple?: []; params?: {} }
    'submissions.form': { paramsTuple?: []; params?: {} }
    'submissions.create': { paramsTuple: [ParamValue, ParamValue]; params: { courseId: ParamValue; assignmentId: ParamValue } }
    'submissions.file': { paramsTuple: [ParamValue, ParamValue]; params: { courseId: ParamValue; assignmentId: ParamValue } }
    'courses.assignments': { paramsTuple: [ParamValue]; params: { courseId: ParamValue } }
    'student_lists.index': { paramsTuple?: []; params?: {} }
    'home': { paramsTuple?: []; params?: {} }
    'assignments.create': { paramsTuple: [ParamValue]; params: {'courseId': ParamValue} }
    'assignments.edit': { paramsTuple: [ParamValue,ParamValue]; params: {'courseId': ParamValue,'assignmentId': ParamValue} }
    'assignments.grade.edit': { paramsTuple: [ParamValue,ParamValue,ParamValue]; params: {'courseId': ParamValue,'assignmentId': ParamValue,'submissionId': ParamValue} }
    'courses.assignments': { paramsTuple: [ParamValue]; params: {'courseId': ParamValue} }
    'assignments.show': { paramsTuple: [ParamValue,ParamValue]; params: {'courseId': ParamValue,'assignmentId': ParamValue} }
    'assignments.file': { paramsTuple: [ParamValue,ParamValue,ParamValue]; params: {'courseId': ParamValue,'assignmentId': ParamValue,'submissionId': ParamValue} }
    'courses.create': { paramsTuple?: []; params?: {} }
    'courses.students': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'courses.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'courses.grades': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
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
    'user_lists.index': { paramsTuple?: []; params?: {} }
    'submissions.form': { paramsTuple?: []; params?: {} }
    'submissions.create': { paramsTuple: [ParamValue, ParamValue]; params: { courseId: ParamValue; assignmentId: ParamValue } }
    'submissions.file': { paramsTuple: [ParamValue, ParamValue]; params: { courseId: ParamValue; assignmentId: ParamValue } }
    'courses.assignments': { paramsTuple: [ParamValue]; params: { courseId: ParamValue } }
    'student_lists.index': { paramsTuple?: []; params?: {} }
    'home': { paramsTuple?: []; params?: {} }
    'assignments.create': { paramsTuple: [ParamValue]; params: {'courseId': ParamValue} }
    'assignments.edit': { paramsTuple: [ParamValue,ParamValue]; params: {'courseId': ParamValue,'assignmentId': ParamValue} }
    'assignments.grade.edit': { paramsTuple: [ParamValue,ParamValue,ParamValue]; params: {'courseId': ParamValue,'assignmentId': ParamValue,'submissionId': ParamValue} }
    'courses.assignments': { paramsTuple: [ParamValue]; params: {'courseId': ParamValue} }
    'assignments.show': { paramsTuple: [ParamValue,ParamValue]; params: {'courseId': ParamValue,'assignmentId': ParamValue} }
    'assignments.file': { paramsTuple: [ParamValue,ParamValue,ParamValue]; params: {'courseId': ParamValue,'assignmentId': ParamValue,'submissionId': ParamValue} }
    'courses.create': { paramsTuple?: []; params?: {} }
    'courses.students': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'courses.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'courses.grades': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  POST: {
    'new_account.store': { paramsTuple?: []; params?: {} }
    'session.store': { paramsTuple?: []; params?: {} }
    'session.destroy': { paramsTuple?: []; params?: {} }
    'profile.update': { paramsTuple?: []; params?: {} }
    'reports.performance.generate': { paramsTuple: [ParamValue]; params: {'courseId': ParamValue} }
    'upload.store': { paramsTuple?: []; params?: {} }
    'assignments.store': { paramsTuple: [ParamValue]; params: {'courseId': ParamValue} }
    'assignments.update': { paramsTuple: [ParamValue,ParamValue]; params: {'courseId': ParamValue,'assignmentId': ParamValue} }
    'assignments.destroy': { paramsTuple: [ParamValue,ParamValue]; params: {'courseId': ParamValue,'assignmentId': ParamValue} }
    'assignments.grade.store': { paramsTuple: [ParamValue,ParamValue,ParamValue]; params: {'courseId': ParamValue,'assignmentId': ParamValue,'submissionId': ParamValue} }
    'assignments.grade.destroy': { paramsTuple: [ParamValue,ParamValue,ParamValue]; params: {'courseId': ParamValue,'assignmentId': ParamValue,'submissionId': ParamValue} }
    'assignments.submit': { paramsTuple: [ParamValue,ParamValue]; params: {'courseId': ParamValue,'assignmentId': ParamValue} }
    'courses.store': { paramsTuple?: []; params?: {} }
    'courses.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}
