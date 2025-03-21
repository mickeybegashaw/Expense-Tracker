import { gql } from "@apollo/client";

export const SIGN_UP = gql`
mutation SignUp($input: signUpInput!){
  signUp(input:$input){
    _id
    name
    username
  }
} 
`
