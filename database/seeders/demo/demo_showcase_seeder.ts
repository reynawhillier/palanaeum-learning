import User from '#models/user'
import app from '@adonisjs/core/services/app'
import db from '@adonisjs/lucid/services/db'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { DateTime } from 'luxon'
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname } from 'node:path'

const DEMO_PASSWORD = 'password123'

type AccountRole = 'admin' | 'professor' | 'student'

type AccountDefinition = {
  key: string
  role: AccountRole
  fullName: string
  email: string
  schoolId: string
  departmentKey?: string
  programKey?: string
}

type CourseDefinition = {
  key: string
  code: string
  name: string
  term: string
  status: 'Active' | 'Archived'
  professorKey: string
  programKey: string
}

type DemoFile = {
  fileName: string
  fileKey: string
  mimeType: string
  fileSize: number
}

type ContentFileType = 'pdf' | 'txt'

type TopicTemplate = {
  title: string
  description: string
  items: Array<{
    title: string
    body: string
    fileType?: ContentFileType
  }>
}

const departments = [
  { key: 'computer-science', name: 'Computer Science' },
  { key: 'mathematics', name: 'Mathematics and Statistics' },
  { key: 'data-science', name: 'Data Science' },
  { key: 'business', name: 'Business and Economics' },
  { key: 'history', name: 'History and Digital Humanities' },
  { key: 'communications', name: 'Communication and Media Studies' },
] as const

const programs = [
  {
    key: 'computer-science-bsc',
    name: 'Computer Science BSc',
    departmentKey: 'computer-science',
  },
  {
    key: 'software-engineering',
    name: 'Software Engineering Option',
    departmentKey: 'computer-science',
  },
  {
    key: 'data-analytics',
    name: 'Data Analytics BSc',
    departmentKey: 'data-science',
  },
  {
    key: 'mathematics-bsc',
    name: 'Mathematics BSc',
    departmentKey: 'mathematics',
  },
  {
    key: 'business-analytics',
    name: 'Business Analytics BBA',
    departmentKey: 'business',
  },
  {
    key: 'digital-humanities',
    name: 'Digital Humanities BA',
    departmentKey: 'history',
  },
  {
    key: 'digital-media',
    name: 'Digital Media Studies BA',
    departmentKey: 'communications',
  },
] as const

const coreAccounts: AccountDefinition[] = [
  {
    key: 'admin-demo',
    role: 'admin',
    fullName: 'Albus Dumbledore',
    email: 'dumbledore@school.ca',
    schoolId: 'DEMO-A001',
  },
  {
    key: 'admin-registrar',
    role: 'admin',
    fullName: 'Rowena Registrar',
    email: 'registrar@school.ca',
    schoolId: 'DEMO-A002',
  },
  {
    key: 'professor-showcase',
    role: 'professor',
    fullName: 'Minerva McGonagall',
    email: 'mcgonagall@school.ca',
    schoolId: 'DEMO-P001',
    departmentKey: 'computer-science',
  },
  {
    key: 'professor-networks',
    role: 'professor',
    fullName: 'Filius Flitwick',
    email: 'flitwick@school.ca',
    schoolId: 'DEMO-P002',
    departmentKey: 'mathematics',
  },
  {
    key: 'professor-software',
    role: 'professor',
    fullName: 'Pomona Sprout',
    email: 'sprout@school.ca',
    schoolId: 'DEMO-P003',
    departmentKey: 'data-science',
  },
  {
    key: 'professor-business',
    role: 'professor',
    fullName: 'Horace Slughorn',
    email: 'slughorn@school.ca',
    schoolId: 'DEMO-P004',
    departmentKey: 'business',
  },
  {
    key: 'professor-history',
    role: 'professor',
    fullName: 'Aurora Sinistra',
    email: 'sinistra@school.ca',
    schoolId: 'DEMO-P005',
    departmentKey: 'history',
  },
  {
    key: 'professor-media',
    role: 'professor',
    fullName: 'Bathsheda Babbling',
    email: 'babbling@school.ca',
    schoolId: 'DEMO-P006',
    departmentKey: 'communications',
  },
  {
    key: 'professor-role-change',
    role: 'professor',
    fullName: 'Robin Unassigned-Course',
    email: 'rolechange.professor@school.ca',
    schoolId: 'DEMO-P099',
    departmentKey: 'computer-science',
  },
]

const studentNames = [
  'James Potter',
  'Hermione Granger',
  'Ron Weasley',
  'Sirius Black',
  'Remus Lupin',
  'Severus Snape',
  'Luna Lovegood',
  'Neville Longbottom',
  'Ginny Weasley',
  'Cho Chang',
  'Cedric Diggory',
  'Dean Thomas',
  'Parvati Patil',
  'Padma Patil',
  'Lavender Brown',
  'Oliver Wood',
  'Angelina Johnson',
  'Katie Bell',
  'Lee Jordan',
  'Susan Bones',
  'Hannah Abbott',
  'Ernie Macmillan',
  'Terry Boot',
  'Michael Corner',
  'Anthony Goldstein',
  'Pansy Parkinson',
  'Blaise Zabini',
  'Theodore Nott',
  'Daphne Greengrass',
  'Marcus Flint',
]

const programCycle = [
  'computer-science-bsc',
  'software-engineering',
  'data-analytics',
  'mathematics-bsc',
  'business-analytics',
  'digital-humanities',
  'digital-media',
]

const studentAccounts: AccountDefinition[] = studentNames.map((fullName, index) => {
  const [firstName, ...lastNameParts] = fullName.split(' ')
  const lastName = lastNameParts.join('.')
  const email =
    index === 0
      ? 'potter@school.ca'
      : `${firstName.toLowerCase()}.${lastName.toLowerCase()}@school.ca`

  return {
    key: `student-${index + 1}`,
    role: 'student',
    fullName,
    email,
    schoolId: `DEMO-S${String(index + 1).padStart(3, '0')}`,
    programKey: programCycle[index % programCycle.length],
  }
})

studentAccounts.push({
  key: 'student-role-change',
  role: 'student',
  fullName: 'Taylor No Enrollments',
  email: 'rolechange.student@school.ca',
  schoolId: 'DEMO-S099',
  programKey: 'computer-science-bsc',
})

const pendingAccounts = [
  {
    fullName: 'Morgan Pending Account',
    email: 'pending.one@school.ca',
  },
  {
    fullName: 'Casey Pending Account',
    email: 'pending.two@school.ca',
  },
  {
    fullName: 'Jamie Pending Account',
    email: 'pending.three@school.ca',
  },
]

const courses: CourseDefinition[] = [
  {
    key: 'cp312',
    code: 'CP312-DEMO',
    name: 'Algorithm Design and Analysis',
    term: 'Fall 2026',
    status: 'Active',
    professorKey: 'professor-showcase',
    programKey: 'computer-science-bsc',
  },
  {
    key: 'cp363',
    code: 'CP363-DEMO',
    name: 'Database Systems',
    term: 'Fall 2026',
    status: 'Active',
    professorKey: 'professor-showcase',
    programKey: 'data-analytics',
  },
  {
    key: 'cp372',
    code: 'CP372-DEMO',
    name: 'Computer Networks',
    term: 'Fall 2026',
    status: 'Active',
    professorKey: 'professor-networks',
    programKey: 'computer-science-bsc',
  },
  {
    key: 'cp317',
    code: 'CP317-DEMO',
    name: 'Software Engineering',
    term: 'Fall 2026',
    status: 'Active',
    professorKey: 'professor-software',
    programKey: 'software-engineering',
  },
  {
    key: 'dh201',
    code: 'DH201-DEMO',
    name: 'Introduction to Generative AI',
    term: 'Fall 2026',
    status: 'Active',
    professorKey: 'professor-history',
    programKey: 'digital-humanities',
  },
  {
    key: 'bu330',
    code: 'BU330-DEMO',
    name: 'Business Analytics and Decision Making',
    term: 'Fall 2026',
    status: 'Active',
    professorKey: 'professor-business',
    programKey: 'business-analytics',
  },
  {
    key: 'ma122',
    code: 'MA122-DEMO',
    name: 'Linear Algebra',
    term: 'Fall 2026',
    status: 'Active',
    professorKey: 'professor-networks',
    programKey: 'mathematics-bsc',
  },
  {
    key: 'ux210',
    code: 'UX210-DEMO',
    name: 'Digital Media Design Studio',
    term: 'Spring 2026',
    status: 'Archived',
    professorKey: 'professor-media',
    programKey: 'digital-media',
  },
]

const assignmentTemplates = [
  {
    title: 'Orientation and Course Readiness Quiz',
    description:
      'Complete the readiness quiz and identify the resources you will use during the course.',
    dueOffsetDays: -21,
  },
  {
    title: 'Core Concepts Written Assignment',
    description:
      'Explain the central concepts from the first unit and support your explanation with examples.',
    dueOffsetDays: -10,
  },
  {
    title: 'Applied Lab and Evidence Package',
    description:
      'Complete the applied lab and submit a short evidence package documenting your results.',
    dueOffsetDays: -3,
  },
  {
    title: 'Midterm Project',
    description:
      'Submit the midterm project with a concise explanation of your design choices and testing.',
    dueOffsetDays: 5,
  },
  {
    title: 'Final Demonstration and Reflection',
    description:
      'Prepare a final demonstration and reflect on the strengths, limitations, and future work.',
    dueOffsetDays: 14,
  },
]

const topicTemplates: TopicTemplate[] = [
  {
    title: 'Start Here',
    description: 'Course orientation, expectations, and the materials needed to begin.',
    items: [
      {
        title: 'Welcome and Learning Outcomes',
        body: 'This page summarizes the course purpose, learning outcomes, and the recommended weekly workflow.',
      },
      {
        title: 'Syllabus and Course Schedule',
        body: 'Download the course syllabus and use it to plan the major assessment dates.',
        fileType: 'pdf' as const,
      },
      {
        title: 'Technology Readiness Checklist',
        body: 'Confirm that the required software, browser, and file-upload tools work before the first deadline.',
        fileType: 'txt' as const,
      },
    ],
  },
  {
    title: 'Weekly Learning Modules',
    description: 'Lecture notes, worked examples, and weekly practice resources.',
    items: [
      {
        title: 'Week 1 Lecture Notes',
        body: 'Foundational terminology and the first worked examples for the course.',
        fileType: 'pdf' as const,
      },
      {
        title: 'Week 2 Practice Guide',
        body: 'A guided practice activity with checkpoints and suggested review questions.',
        fileType: 'txt' as const,
      },
      {
        title: 'Sample Data Set',
        body: 'A small comma-separated data set used in the demonstration exercises.',
        fileType: 'txt' as const,
      },
    ],
  },
  {
    title: 'Assessments and Rubrics',
    description: 'Assignment instructions, marking criteria, and submission expectations.',
    items: [
      {
        title: 'Assignment Submission Guide',
        body: 'Review the accepted file types, filename expectations, and resubmission workflow.',
        fileType: 'pdf' as const,
      },
      {
        title: 'Marking Rubric',
        body: 'The rubric describes the criteria used for accuracy, explanation, evidence, and presentation.',
        fileType: 'txt' as const,
      },
      {
        title: 'Academic Integrity Reminder',
        body: 'Submitted work must identify sources and clearly distinguish original work from assistance.',
      },
    ],
  },
  {
    title: 'Review and Exam Preparation',
    description: 'Consolidated review material and a final preparation checklist.',
    items: [
      {
        title: 'Unit Review Package',
        body: 'A structured review of the major ideas, common errors, and representative questions.',
        fileType: 'pdf' as const,
      },
      {
        title: 'Practice Question Checklist',
        body: 'Use this checklist to track completed practice questions and areas that need more review.',
        fileType: 'txt' as const,
      },
      {
        title: 'Final Preparation Notes',
        body: 'Focus on explaining your reasoning, checking assumptions, and validating final results.',
      },
    ],
  },
]

export default class DemoShowcaseSeeder extends BaseSeeder {
  static environment = ['development']

  async run() {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('The demo showcase seeder must never run in production.')
    }

    await this.ensureRolePlaceholder()

    const departmentIds = await this.seedDepartments()
    const programIds = await this.seedPrograms(departmentIds)
    const accountIds = await this.seedAccounts(departmentIds, programIds)
    await this.seedPendingAccounts()

    const courseIds = await this.seedCourses(accountIds, programIds)
    const enrolledStudentKeys = studentAccounts.filter(
      (account) => account.key !== 'student-role-change'
    )

    await this.seedEnrollments(courseIds, accountIds, enrolledStudentKeys)
    await this.seedContent(courseIds, accountIds)
    await this.seedAssessments(courseIds, accountIds, enrolledStudentKeys)
  }

  private async ensureRolePlaceholder() {
    const existing = await db.from('roles').where('id', 1).first()

    if (!existing) {
      await db.table('roles').insert({ id: 1, created_at: new Date(), updated_at: new Date() })
    }
  }

  private async seedDepartments() {
    const ids = new Map<string, number>()

    for (const department of departments) {
      const departmentId = await this.upsertRow(
        'departments',
        { department_name: department.name },
        { department_name: department.name },
        'department_id'
      )

      ids.set(department.key, departmentId)
    }

    return ids
  }

  private async seedPrograms(departmentIds: Map<string, number>) {
    const ids = new Map<string, number>()

    for (const program of programs) {
      const departmentId = this.requireMapValue(departmentIds, program.departmentKey)
      const programId = await this.upsertRow(
        'programs',
        { program_name: program.name },
        {
          program_name: program.name,
          department_id: departmentId,
        },
        'program_id'
      )

      ids.set(program.key, programId)
    }

    return ids
  }

  private async seedAccounts(departmentIds: Map<string, number>, programIds: Map<string, number>) {
    const accountIds = new Map<string, number>()
    const accounts = [...coreAccounts, ...studentAccounts]

    for (const account of accounts) {
      const user = await User.updateOrCreate(
        { email: account.email },
        {
          fullName: account.fullName,
          email: account.email,
          password: DEMO_PASSWORD,
        }
      )

      if (account.role === 'admin') {
        const adminId = await this.upsertRow(
          'admins',
          { email: account.email },
          {
            user_id: user.id,
            school_id: account.schoolId,
            first_name: this.firstName(account.fullName),
            last_name: this.lastName(account.fullName),
            email: account.email,
            password_hash: user.password,
          },
          'admin_id'
        )

        accountIds.set(account.key, adminId)
      }

      if (account.role === 'professor') {
        const departmentId = this.requireMapValue(departmentIds, account.departmentKey!)
        const professorId = await this.upsertRow(
          'professors',
          { email: account.email },
          {
            user_id: user.id,
            school_id: account.schoolId,
            first_name: this.firstName(account.fullName),
            last_name: this.lastName(account.fullName),
            email: account.email,
            password_hash: user.password,
            department_id: departmentId,
          },
          'professor_id'
        )

        accountIds.set(account.key, professorId)
      }

      if (account.role === 'student') {
        const programId = this.requireMapValue(programIds, account.programKey!)
        const studentId = await this.upsertRow(
          'students',
          { email: account.email },
          {
            user_id: user.id,
            school_id: account.schoolId,
            first_name: this.firstName(account.fullName),
            last_name: this.lastName(account.fullName),
            email: account.email,
            password_hash: user.password,
            program_id: programId,
          },
          'student_id'
        )

        accountIds.set(account.key, studentId)
      }
    }

    return accountIds
  }

  private async seedPendingAccounts() {
    for (const account of pendingAccounts) {
      await User.updateOrCreate(
        { email: account.email },
        {
          fullName: account.fullName,
          email: account.email,
          password: DEMO_PASSWORD,
        }
      )
    }
  }

  private async seedCourses(accountIds: Map<string, number>, programIds: Map<string, number>) {
    const courseIds = new Map<string, number>()

    for (const course of courses) {
      const courseId = await this.upsertRow(
        'courses',
        { course_code: course.code },
        {
          course_code: course.code,
          course_name: course.name,
          term: course.term,
          status: course.status,
          professor_id: this.requireMapValue(accountIds, course.professorKey),
          program_id: this.requireMapValue(programIds, course.programKey),
        },
        'course_id'
      )

      courseIds.set(course.key, courseId)
    }

    return courseIds
  }

  private async seedEnrollments(
    courseIds: Map<string, number>,
    accountIds: Map<string, number>,
    students: AccountDefinition[]
  ) {
    for (const [courseIndex, course] of courses.entries()) {
      const courseId = this.requireMapValue(courseIds, course.key)
      const enrollmentTarget = course.status === 'Active' ? 20 : 12

      const selectedStudents = students
        .filter((_, studentIndex) => (studentIndex + courseIndex * 2) % 3 !== 0)
        .slice(0, enrollmentTarget)

      if (course.key === 'cp312') {
        const showcaseStudent = students.find((student) => student.key === 'student-1')!
        if (!selectedStudents.some((student) => student.key === showcaseStudent.key)) {
          selectedStudents.unshift(showcaseStudent)
        }
      }

      for (const student of selectedStudents) {
        const studentId = this.requireMapValue(accountIds, student.key)
        await this.upsertRow(
          'enrollments',
          { student_id: studentId, course_id: courseId },
          {
            student_id: studentId,
            course_id: courseId,
            enrollment_status: course.status === 'Archived' ? 'Completed' : 'Active',
          },
          'enrollment_id'
        )
      }
    }
  }

  private async seedContent(courseIds: Map<string, number>, accountIds: Map<string, number>) {
    const now = DateTime.now()

    for (const [courseIndex, course] of courses.entries()) {
      const courseId = this.requireMapValue(courseIds, course.key)
      const professorId = this.requireMapValue(accountIds, course.professorKey)

      for (const [topicIndex, topic] of topicTemplates.entries()) {
        const topicCreatedAt = now.minus({ days: 28 - topicIndex * 7 + courseIndex })
        const topicId = await this.upsertRow(
          'course_content_topics',
          { course_id: courseId, title: topic.title },
          {
            course_id: courseId,
            professor_id: professorId,
            title: topic.title,
            description: `${topic.description} This section is populated with demonstration data for ${course.code}.`,
            created_at: topicCreatedAt.toJSDate(),
            updated_at: now.toJSDate(),
          },
          'content_topic_id'
        )

        for (const [itemIndex, item] of topic.items.entries()) {
          let file: DemoFile | null = null

          if (item.fileType) {
            file = await this.writeContentFile(
              course,
              topic.title,
              item.title,
              item.fileType,
              item.body
            )
          }

          await this.upsertRow(
            'course_content_items',
            { content_topic_id: topicId, title: item.title },
            {
              content_topic_id: topicId,
              title: item.title,
              body: `${item.body}\n\nCourse: ${course.code} - ${course.name}`,
              file_name: file?.fileName ?? null,
              file_key: file?.fileKey ?? null,
              mime_type: file?.mimeType ?? null,
              file_size: file?.fileSize ?? null,
              created_at: topicCreatedAt.plus({ hours: itemIndex + 1 }).toJSDate(),
              updated_at: now.toJSDate(),
            },
            'content_item_id'
          )
        }
      }
    }
  }

  private async seedAssessments(
    courseIds: Map<string, number>,
    accountIds: Map<string, number>,
    students: AccountDefinition[]
  ) {
    const today = DateTime.now().startOf('day')

    for (const [courseIndex, course] of courses.entries()) {
      const courseId = this.requireMapValue(courseIds, course.key)
      const professorId = this.requireMapValue(accountIds, course.professorKey)
      const enrolledRows = await db
        .from('enrollments')
        .where('course_id', courseId)
        .orderBy('student_id', 'asc')
        .select('student_id')
      const enrolledStudentIds = new Set(enrolledRows.map((row) => Number(row.student_id)))
      const enrolledStudents = students.filter((student) =>
        enrolledStudentIds.has(this.requireMapValue(accountIds, student.key))
      )

      for (const [assignmentIndex, template] of assignmentTemplates.entries()) {
        const dueDate = today.plus({ days: template.dueOffsetDays })
        const assignmentTitle = `${course.code} ${template.title}`
        const assignmentId = await this.upsertRow(
          'assignments',
          { course_id: courseId, title: assignmentTitle },
          {
            course_id: courseId,
            title: assignmentTitle,
            description: `${template.description} This demonstration assignment belongs to ${course.name}.`,
            due_date: dueDate.toISODate(),
            status: template.dueOffsetDays < 0 ? 'Closed' : 'Open',
          },
          'assignment_id'
        )

        for (const [studentIndex, student] of enrolledStudents.entries()) {
          const studentId = this.requireMapValue(accountIds, student.key)
          const shouldSubmit = this.shouldCreateSubmission(
            courseIndex,
            assignmentIndex,
            studentIndex,
            student.key
          )

          if (!shouldSubmit) {
            continue
          }

          const isLate = (courseIndex + assignmentIndex + studentIndex) % 4 === 0
          const submittedAt = isLate
            ? dueDate.plus({ days: 1, hours: 3 })
            : dueDate.minus({ days: 2, hours: studentIndex % 5 })
          const submissionFile = await this.writeSubmissionFile(
            course,
            assignmentTitle,
            student,
            assignmentIndex,
            submittedAt
          )
          const submissionId = await this.upsertRow(
            'submissions',
            { assignment_id: assignmentId, student_id: studentId },
            {
              assignment_id: assignmentId,
              student_id: studentId,
              file_name: submissionFile.fileName,
              file_key: submissionFile.fileKey,
              mime_type: submissionFile.mimeType,
              file_size: submissionFile.fileSize,
              submitted_at: submittedAt.toJSDate(),
              status: isLate ? 'Late' : 'Submitted',
            },
            'submission_id'
          )

          const shouldGrade =
            assignmentIndex < 3 && (courseIndex + assignmentIndex * 2 + studentIndex) % 6 !== 0

          if (!shouldGrade) {
            continue
          }

          const score = this.scoreFor(courseIndex, assignmentIndex, studentIndex)
          await this.upsertRow(
            'grades',
            { submission_id: submissionId },
            {
              submission_id: submissionId,
              professor_id: professorId,
              score,
              feedback: this.feedbackFor(score, isLate),
              graded_at: submittedAt.plus({ days: 2, hours: 4 }).toJSDate(),
            },
            'grade_id'
          )
        }
      }
    }
  }

  private shouldCreateSubmission(
    courseIndex: number,
    assignmentIndex: number,
    studentIndex: number,
    studentKey: string
  ) {
    if (studentKey === 'student-1' && courseIndex === 0) {
      return assignmentIndex < 4
    }

    if (assignmentIndex === 4) {
      return (courseIndex + studentIndex) % 7 === 0
    }

    return (courseIndex * 2 + assignmentIndex + studentIndex) % 5 !== 0
  }

  private scoreFor(courseIndex: number, assignmentIndex: number, studentIndex: number) {
    const score = 48 + ((courseIndex * 13 + assignmentIndex * 9 + studentIndex * 7) % 51)
    return Number(score.toFixed(2))
  }

  private feedbackFor(score: number, isLate: boolean) {
    const lateNote = isLate ? ' The submission was received after the due date.' : ''

    if (score >= 90) {
      return `Excellent work. The explanation is precise, complete, and supported by strong evidence.${lateNote}`
    }

    if (score >= 80) {
      return `Strong work overall. A few details could be developed further, but the main requirements are met.${lateNote}`
    }

    if (score >= 70) {
      return `Good progress. Review the rubric comments and strengthen the explanation of the final result.${lateNote}`
    }

    if (score >= 60) {
      return `The submission meets the minimum requirements. More evidence and clearer reasoning are needed.${lateNote}`
    }

    return `This submission needs revision. Meet with the professor to review the missing steps and resubmission plan.${lateNote}`
  }

  private async writeContentFile(
    course: CourseDefinition,
    topicTitle: string,
    itemTitle: string,
    fileType: ContentFileType,
    body: string
  ) {
    const baseName = `${this.slug(course.code)}-${this.slug(itemTitle)}`
    const fileKey = `demo/content/${this.slug(course.code)}/${this.slug(topicTitle)}/${baseName}.${fileType}`

    if (fileType === 'pdf') {
      const contents = this.simplePdf(`${course.code}: ${itemTitle}`, [
        body,
        `Course: ${course.name}`,
        'This file was generated by the Palanaeum Learning demonstration seeder.',
      ])

      return this.writeFile(fileKey, `${baseName}.pdf`, 'application/pdf', contents)
    }

    const contents = Buffer.from(
      [
        `${course.code} - ${course.name}`,
        itemTitle,
        '',
        body,
        '',
        'Generated for the Palanaeum Learning final demonstration.',
      ].join('\n'),
      'utf8'
    )

    return this.writeFile(fileKey, `${baseName}.txt`, 'text/plain', contents)
  }

  private async writeSubmissionFile(
    course: CourseDefinition,
    assignmentTitle: string,
    student: AccountDefinition,
    assignmentIndex: number,
    submittedAt: DateTime
  ) {
    const studentName = this.slug(student.fullName)
    const assignmentName = this.slug(assignmentTitle)
    const usePdf = assignmentIndex % 2 === 0
    const extension = usePdf ? 'pdf' : 'txt'
    const fileName = `${studentName}-${assignmentName}.${extension}`
    const fileKey = `demo/submissions/${this.slug(course.code)}/${assignmentName}/${fileName}`
    const lines = [
      `Student: ${student.fullName}`,
      `Course: ${course.code} - ${course.name}`,
      `Assignment: ${assignmentTitle}`,
      `Submitted: ${submittedAt.toISO()}`,
      '',
      'Demonstration submission summary:',
      'The student completed the required work, documented the process, and included evidence supporting the final result.',
      'This file exists so the secure submission download feature can be shown during the final video.',
    ]

    if (usePdf) {
      return this.writeFile(
        fileKey,
        fileName,
        'application/pdf',
        this.simplePdf(assignmentTitle, lines)
      )
    }

    return this.writeFile(fileKey, fileName, 'text/plain', Buffer.from(lines.join('\n'), 'utf8'))
  }

  private async writeFile(
    fileKey: string,
    fileName: string,
    mimeType: string,
    contents: Buffer
  ): Promise<DemoFile> {
    const absolutePath = app.makePath('storage', fileKey)
    await mkdir(dirname(absolutePath), { recursive: true })
    await writeFile(absolutePath, contents)

    return {
      fileName,
      fileKey,
      mimeType,
      fileSize: contents.byteLength,
    }
  }

  private simplePdf(title: string, lines: string[]) {
    const escapedTitle = this.escapePdfText(title)
    const bodyLines = lines.slice(0, 18).map((line) => this.escapePdfText(line))
    const contentCommands = [
      'BT',
      '/F1 18 Tf',
      '72 740 Td',
      `(${escapedTitle}) Tj`,
      '/F1 11 Tf',
      '0 -30 Td',
      ...bodyLines.flatMap((line, index) => [
        index === 0 ? `(${line}) Tj` : '0 -18 Td',
        ...(index === 0 ? [] : [`(${line}) Tj`]),
      ]),
      'ET',
    ]
    const stream = contentCommands.join('\n')
    const objects = [
      '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n',
      '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n',
      '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n',
      '4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n',
      `5 0 obj\n<< /Length ${Buffer.byteLength(stream, 'utf8')} >>\nstream\n${stream}\nendstream\nendobj\n`,
    ]

    let pdf = '%PDF-1.4\n'
    const offsets = [0]

    for (const object of objects) {
      offsets.push(Buffer.byteLength(pdf, 'utf8'))
      pdf += object
    }

    const xrefOffset = Buffer.byteLength(pdf, 'utf8')
    pdf += `xref\n0 ${objects.length + 1}\n`
    pdf += '0000000000 65535 f \n'

    for (const offset of offsets.slice(1)) {
      pdf += `${String(offset).padStart(10, '0')} 00000 n \n`
    }

    pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\n`
    pdf += `startxref\n${xrefOffset}\n%%EOF\n`

    return Buffer.from(pdf, 'utf8')
  }

  private escapePdfText(value: string) {
    return value.replaceAll('\\', '\\\\').replaceAll('(', '\\(').replaceAll(')', '\\)')
  }

  private slug(value: string) {
    return value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  private firstName(fullName: string) {
    return fullName.trim().split(/\s+/)[0]
  }

  private lastName(fullName: string) {
    const parts = fullName.trim().split(/\s+/)
    return parts.length > 1 ? parts.slice(1).join(' ') : 'User'
  }

  private requireMapValue(map: Map<string, number>, key: string) {
    const value = map.get(key)

    if (!value) {
      throw new Error(`Missing required seeded value for key "${key}".`)
    }

    return value
  }

  private async upsertRow(
    table: string,
    where: Record<string, unknown>,
    values: Record<string, unknown>,
    primaryKey: string
  ) {
    const existing = await db.from(table).where(where).first()

    if (existing) {
      await db.from(table).where(where).update(values)
      return Number(existing[primaryKey])
    }

    const [insertedId] = await db.table(table).insert(values)
    return Number(insertedId)
  }
}
