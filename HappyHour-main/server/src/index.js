import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import express from "express";
import dotenv from 'dotenv';
import cors from "cors";
import mongoose from "mongoose";
import http from 'http';
import socket from 'socket.io';
import stream from '../ws/stream.js';

dotenv.config();
const app = express();

let server = http.Server( app );
let io = socket( server );

app.use( express.json() );
app.use( express.urlencoded() );
app.use( cors() );

const __filename = fileURLToPath( import.meta.url );
const __dirname = dirname( __filename );

app.use( '/assets', express.static( join( __dirname, '../assets' ) ) );
const DB = process.env.MONGO;

mongoose.connect( DB, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true,
	useFindAndModify: false
} ).then( () => {
	console.log( "DB connected" );
} ).catch( ( err ) => console.log( 'no connection' ) );

const userSchema = new mongoose.Schema( {
	name: String,
	email: String,
	password: String
} );

const User = new mongoose.model( "User", userSchema );

const ratingScheme = new mongoose.Schema( {
	rating: Number
} );

const Rating = new mongoose.model( "Rating", ratingScheme );

//Routes
app.post( "/login", ( req, res ) => {
	const { email, password } = req.body;
	User.findOne( { email: email }, ( err, user ) => {
		if ( user ) {
			if ( password === user.password ) {
				res.send( { message: "Login Successfull", user: user } );
			} else {
				res.send( { message: "Password didn't match" } );
			}
		} else {
			res.send( { message: "User not registered" } );
		}
	} );
} );

app.post( "/register", ( req, res ) => {
	const { name, email, password } = req.body;
	User.findOne( { email: email }, ( err, user ) => {
		if ( user ) {
			res.send( { message: "User already registerd" } );
		} else {
			const user = new User( {
				name,
				email,
				password
			} );
			user.save( err => {
				if ( err ) {
					res.send( err );
				} else {
					res.send( { message: "Successfully Registered, Please login now." } );
				}
			} );
		}
	} );

} );

app.post( '/payment/orders', ( req, res ) => {
	const amount = 1000;
	const order_id = new Date().getTime();
	const currency = 'INR';

	res.json( { amount, order_id, currency } );
} );

app.post( '/payment/success', ( req, res ) => {
	res.json( {
		success: true
	} );
} );

app.get( '/set-rating/:rating', async ( req, res ) => {
	const { rating } = req.params;

	if ( !rating ) {
		return res.sendStatus( 400 );
	}

	const hasRating = await Rating.findOne();
	if ( !hasRating ) {
		const ratingD = await Rating.create( { rating: parseFloat( rating ) } );
	} else {
		const ratingD = await Rating.findOneAndUpdate( {}, { rating: parseFloat( rating ) } );
	}

	res.sendStatus( 200 );

} );

app.get( '/get-rating', async ( req, res ) => {
	const rating = await Rating.findOne();

	if ( !rating ) {
		res.sendStatus( 404 );
	} else {
		res.send( rating );
	}

} );

app.get( '/', ( req, res ) => {
	res.sendFile( join( __dirname, '../views/index.html' ) );
} );

app.get( '/models/*', ( req, res ) => {
	res.sendFile( join( __dirname, `../models/${ req.params[ 0 ] }` ) );
} );

io.of( '/stream' ).on( 'connection', stream );

server.listen( 9002, () => {
	console.log( "BE started at port 9002" );
} );