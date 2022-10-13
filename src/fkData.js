import { faker } from '@faker-js/faker';
import  fs  from "fs";

const generatePersonsData = (number = 200) => {
  const persons = [];
  while (number >= 0) {
    persons.push({
      id:number,
      username: faker.internet.userName(),
      contact: {
        email: faker.internet.email(),
        phone: faker.phone.number()
      },
      firstName: faker.name.firstName(),
      lastName: faker.name.firstName(),
      picture: faker.image.people(),
      country: faker.address.country(),
      birthDate: faker.date.future(),
      gender: faker.name.gender(),
      geo: {
        type: 'Point',
        coordinates: [ faker.address.latitude(), faker.address.longitude() ]
      }
    });
    number--;
  }
  return persons;
};

const generateCustomer = (persons, number = 100) => {
  console.log('Updating Customer data');
  persons.filter(function (person) {
    if (this.count < number && (person.isEmployee === undefined || !person.isEmployee)) {
      this.count++;
      return true;
    }
    return false;
  }, { count: 0 }).sort((a, b) => {
    const result = a.firstName.localeCompare(b.firstName);
    return result !== 0 ? result : a.lastName.localeCompare(b.lastName);
  }).map((customer) => {
    let address = {
      address: faker.address.streetAddress(),
      address2: faker.address.secondaryAddress(),
      state: faker.address.state(),
      zipCode: faker.address.zipCode(),
      city: faker.address.city(),
      country: faker.address.country()
    }
    customer.address = address;
    customer.isCustomer = true;
  });
  return persons;
};

const generateEmployee = (persons, number = 25) => {
  console.log('Updating Employee data');
  persons.filter(function(person) {
      if (this.count < number && (person.isCustomer === undefined || !person.isCustomer)) {
        this.count++;
        return true;
      }
      return false;
    }, { count: 0 })
    .sort((a, b) => {
      const result = a.lastName.localeCompare(b.lastName);
      return result !== 0 ? result : a.firstName.localeCompare(b.firstName);
    }).forEach((employee) => {
      let address = {
        address: faker.address.streetAddress(),
        address2: faker.address.secondaryAddress(),
        state: faker.address.state(),
        zipCode: faker.address.zipCode(),
        city: faker.address.city(),
        country: faker.address.country()
      }
      employee.address = address;
      employee.isEmployee = true
      employee.salary = faker.datatype.number({
        min: 300000,
        max: 5000000
      });
      employee.jobTitle = faker.name.jobTitle();
      employee.jobTitle = faker.name.jobType();
    });
  return persons;
};

const generateProduct = (number = 50) => {
  const products = [];
  while (number >= 0) {
    products.push({
      id:number,
      product: faker.commerce.product(),
      productName: faker.commerce.productName(),
      productDescription: faker.commerce.productDescription(),
      productMaterial: faker.commerce.productMaterial(),
      description: faker.lorem.paragraphs(2),
      price: parseFloat(faker.commerce.price(10, 5000, 2)) + parseFloat(faker.commerce.price(10, 99, 0) ) * 0.01,
      department: faker.commerce.department(),
      productImage: faker.image.fashion(200, 200, true)
    });
    number--;
  }
  return products;
};


const generateBrand = (number = 8) => {
  const brands = [];
  while (number >= 0) {
    brands.push({
      id:number,
      brand: faker.company.name(),
      catchPhrase: faker.company.catchPhrase(),
      productImage: faker.image.business(200, 200, true)
    });
    number--;
  }
  return brands;
};


const generateBulkData = () => {
  let bulkData = {};
  const brands = generateBrand();
  const products = generateProduct();
  const persons = generatePersonsData();
  const employees = generateEmployee(persons).filter((person)=> person.isEmployee);
  const customers = generateCustomer(persons).filter((person)=> person.isCustomer);
  const onlyPersons = persons.filter((person) =>  person.isEmployee === undefined && person.isCustomer === undefined)
  bulkData = { ...bulkData, brands, products, persons: onlyPersons, employees, customers};
  return bulkData;
}


fs.writeFileSync(
  "./db/db.json",
  JSON.stringify(generateBulkData(), " ", 4 )
);
