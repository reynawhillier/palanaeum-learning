export const fakeUsers = {
  student: {
    id: 1,
    fullName: 'Jane Doe',
    role: 'student',

    courses: [
      {
        id: 101,
        code: 'CP164',
        name: 'Data Structures',
        professor: 'Dr. Johnson',
        term: 'Fall 2026',
        description: 'Lists, trees, sorting, and algorithms.'
      },
      {
        id: 102,
        code: 'CP213',
        name: 'Object Oriented Programming',
        professor: 'Dr. Park',
        term: 'Fall 2026',
        description: 'Object-oriented design and Java programming.'
      }
    ]
  },


  professor: {
    id: 2,
    fullName: 'Dr. Smith',
    role: 'professor',

    courses: [
      {
        id: 101,
        code: 'CP164',
        name: 'Data Structures',
        students: 85,
        term: 'Fall 2026',
        description: 'Lists, trees, sorting, and algorithms.'
      },
      {
        id: 103,
        code: 'CP264',
        name: 'Advanced Data Structures',
        students: 60,
        term: 'Fall 2026',
        description: 'Graphs, complexity analysis, and advanced algorithms.'
      }
    ]
  },


  admin: {
    id: 3,
    fullName: 'Admin User',
    role: 'admin'
  }
}