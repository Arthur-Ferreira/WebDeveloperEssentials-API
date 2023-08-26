const db = require('../data/databse');

class User {
  constructor(email, password, fullname, street, postal, city) {
    this.email = email;
    this.password = password;
    this.name = fullname;
    this.adress = {
      street: street,
      postalCode: postal,
      city: city
    };
  }
  
  signup() {
    db.getDb().collection('users').insertOne({
      email: this.email,
      password: this.password,
      name: this.fullname,
      adress: this.adress
    });
  }
}
