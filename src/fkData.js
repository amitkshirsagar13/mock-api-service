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
      description: faker.lorem.paragraphs(2),
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
    console.log('Updating Customer data');
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
      console.log('Updating Employee data');
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
      price: faker.commerce.price(),
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
      brand: faker.company.companyName(),
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
  generateEmployee(persons);
  generateCustomer(persons);
  bulkData = { ...bulkData, brands, products, persons};
  return bulkData;
}


fs.writeFileSync(
  "./db/db.json",
  JSON.stringify(generateBulkData(), " ", 4 )
);
