import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'drive.fs.serve': { paramsTuple: [...ParamValue[]]; params: { '*': ParamValue[] } }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'new_account.store': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'session.store': { paramsTuple?: []; params?: {} }
    'session.destroy': { paramsTuple?: []; params?: {} }
    'student_lists.index': { paramsTuple?: []; params?: {} }
    'reports.performance.print': { paramsTuple: [ParamValue]; params: { courseId: ParamValue } }
    'reports.performance': { paramsTuple: [ParamValue]; params: { courseId: ParamValue } }
    'reports.performance.generate.get': { paramsTuple: [ParamValue]; params: { courseId: ParamValue } }
    'reports.performance.generate': { paramsTuple: [ParamValue]; params: { courseId: ParamValue } }
    'user_lists.index': { paramsTuple?: []; params?: {} }
    'submissions.form': { paramsTuple?: []; params?: {} }
    'submissions.validate': { paramsTuple?: []; params?: {} }
    'submissions.create': { paramsTuple: [ParamValue, ParamValue]; params: { courseId: ParamValue; assignmentId: ParamValue } }
    'submissions.store': { paramsTuple: [ParamValue, ParamValue]; params: { courseId: ParamValue; assignmentId: ParamValue } }
    'submissions.file': { paramsTuple: [ParamValue, ParamValue]; params: { courseId: ParamValue; assignmentId: ParamValue } }
    'courses.assignments': { paramsTuple: [ParamValue]; params: { courseId: ParamValue } }
    'home': { paramsTuple?: []; params?: {} }
    'assignments.index': { paramsTuple?: []; params?: {} }
    'assignments.store': { paramsTuple?: []; params?: {} }
    'upload.store': { paramsTuple?: []; params?: {} }
  }
  GET: {
    'drive.fs.serve': { paramsTuple: [...ParamValue[]]; params: { '*': ParamValue[] } }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'student_lists.index': { paramsTuple?: []; params?: {} }
    'reports.performance.print': { paramsTuple: [ParamValue]; params: { courseId: ParamValue } }
    'reports.performance': { paramsTuple: [ParamValue]; params: { courseId: ParamValue } }
    'reports.performance.generate.get': { paramsTuple: [ParamValue]; params: { courseId: ParamValue } }
    'user_lists.index': { paramsTuple?: []; params?: {} }
    'submissions.form': { paramsTuple?: []; params?: {} }
    'submissions.create': { paramsTuple: [ParamValue, ParamValue]; params: { courseId: ParamValue; assignmentId: ParamValue } }
    'submissions.file': { paramsTuple: [ParamValue, ParamValue]; params: { courseId: ParamValue; assignmentId: ParamValue } }
    'courses.assignments': { paramsTuple: [ParamValue]; params: { courseId: ParamValue } }
    'home': { paramsTuple?: []; params?: {} }
    'assignments.index': { paramsTuple?: []; params?: {} }
  }
  HEAD: {
    'drive.fs.serve': { paramsTuple: [...ParamValue[]]; params: { '*': ParamValue[] } }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'student_lists.index': { paramsTuple?: []; params?: {} }
    'reports.performance.print': { paramsTuple: [ParamValue]; params: { courseId: ParamValue } }
    'reports.performance': { paramsTuple: [ParamValue]; params: { courseId: ParamValue } }
    'reports.performance.generate.get': { paramsTuple: [ParamValue]; params: { courseId: ParamValue } }
    'user_lists.index': { paramsTuple?: []; params?: {} }
    'submissions.form': { paramsTuple?: []; params?: {} }
    'submissions.create': { paramsTuple: [ParamValue, ParamValue]; params: { courseId: ParamValue; assignmentId: ParamValue } }
    'submissions.file': { paramsTuple: [ParamValue, ParamValue]; params: { courseId: ParamValue; assignmentId: ParamValue } }
    'courses.assignments': { paramsTuple: [ParamValue]; params: { courseId: ParamValue } }
    'home': { paramsTuple?: []; params?: {} }
    'assignments.index': { paramsTuple?: []; params?: {} }
  }
  POST: {
    'new_account.store': { paramsTuple?: []; params?: {} }
    'session.store': { paramsTuple?: []; params?: {} }
    'session.destroy': { paramsTuple?: []; params?: {} }
    'submissions.validate': { paramsTuple?: []; params?: {} }
    'submissions.store': { paramsTuple: [ParamValue, ParamValue]; params: { courseId: ParamValue; assignmentId: ParamValue } }
    'reports.performance.generate': { paramsTuple: [ParamValue]; params: { courseId: ParamValue } }
    'assignments.store': { paramsTuple?: []; params?: {} }
    'upload.store': { paramsTuple?: []; params?: {} }
  }
}

declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}
