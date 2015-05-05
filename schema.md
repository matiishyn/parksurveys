/parks/:id
/users/:id(/edit)
/admin
/admin/parks(:/id)
/admin/users(:/id)

parks {
  name: string,
  description: string,
  image: string,
  position: {
    lat: 55,
    lon: 37
  },
  questions: {
    title: string,
    type: string, // 'checkbox' or 'input' or 'radio'
    customAllowed: boolean, // field 'other'
    answers: {
      title: string
    }
  },
},
users {
  phone: int,
  roles: array,
  surveys: {
    id: string
  },
},
surveys {
  percent: int,
  questions: {
    type: string,
    answer: string or array // string for input
  }
}