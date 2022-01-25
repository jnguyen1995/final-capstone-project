# Restaurant Reservations App

## Deployed Website
[Deployed Website](https://rest-res-frontend.herokuapp.com/dashboard)

## Summary
The Restaurant Reservations App is a full stack web application that allows users to create, edit, and cancel a reservation on a specific date.\
The application also allows users to seat a reservation to a table, and clear the table when the reservation party has finished eating.\
The application also allows users to search their reservation details by mobile number, or by the date of the reservation.

This project was completed using React, Node, CSS, Express, Knex, Bootstrap, and PostgreSQL.

### Dashboard
![Dashboard_Page](https://user-images.githubusercontent.com/89476020/151012814-8210af4b-e882-444d-9ea2-0c3cbde98e90.JPG)

### Create Reservation Page
![CreateReservationPage](https://user-images.githubusercontent.com/89476020/151012863-09a79523-7007-4429-b490-5ffe28e7df24.JPG)

### Edit Reservation Page
![EditReservationPage](https://user-images.githubusercontent.com/89476020/151012882-474ad242-84db-4309-9520-6663e6ee35cb.JPG)

### Create Table Page
![CreateTablePage](https://user-images.githubusercontent.com/89476020/151012886-60c7c046-3b0f-4759-b346-4737d1dbb854.JPG)

### Seat Reservation Page
![SeatReservationPage](https://user-images.githubusercontent.com/89476020/151012943-fe59ee2e-f316-43e0-a190-cab0bef5d930.JPG)

### Search for Reservation Page
![SearchPage](https://user-images.githubusercontent.com/89476020/151012981-b736f8d5-aaa2-4e68-a925-9404a45a403b.JPG)

## Technologies Used
- Javascript
- React
- Express
- Knex
- Node
- HTML
- CSS
- PostGreSQL
- Bootstrap
- Heroku
- Trello for keeping track of User Stories completed, in progress, and in the backlog.

## API Documentation
| Route | Method | Status Code | Description |
|-------|--------|-------------|-------------|
| /reservations | GET | 200 | Returns list of reservations for current date |
| /reservations?date=####-##-## | GET | 200 | Returns list of reservations for given date |
| /reservations | POST | 202 | Creates a new reservations |
| /reservations/:reservation_id | GET | 200 | Returns reservation for given ID |
| /reservations/:reservation_id | PUT | 200 | Updates reservation for given ID |
| /reservations/:reservation_id/status | PUT | 200 | Updates status of reservation for given ID |
| /tables | GET | 200 | Returns list of tables |
| /tables | POST | 201 | Creates a new table |
| /tables/:table_id/seat | PUT | 200 | Seats a reservation at the given table ID |
| /tables/:table_id/seat | DELETE | 200 | Changes status to unoccupied for given table ID |

### Reservation JSON Example
```"data": {
       "reservation_id": 22,
       "first_name": "Paul",
       "last_name": "Atreides",
       "mobile_number": "123-456-7890",
       "reservation_date": "2022-01-26T04:00:00.000Z",
       "reservation_time": "18:00:00",
       "people": 1,
       "status": "booked",
       "created_at": "2022-01-26T04:00:00.000Z",
       "updated_at": "2022-01-26T08:00:00.000Z"
   }
   ```

### Table JSON Example
```{
           "table_id": 4,
           "table_name": "The 'Plus One'",
           "capacity": 3,
           "reservation_id": 22
       }
```
## Installation
To install dependencies, use npm install on the project root directory:

```npm install || npm i```

To start up the app, run ```npm run start``` in the main project directory.
