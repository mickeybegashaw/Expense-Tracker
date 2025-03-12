const userTypeDef = ` 
 type User {
    _id :ID!
    username : String!
    email :String!
    name :String!
    password :String!
    profilePicture :String
    gender :String
 }

 type Query {
    authUser :User
    user(userId:ID!) :User
 }

 type Mutation{
    signUp(input : signUpInput) :User
    logIn(input : LoginInput) :User
    logOut :LogOutResponse
 }

 input signUpInput{
    username :String!
    email : String!
    password :String!
    gender :String
 }

 input LoginInput{
    username :String!
    password :String!
 }

 type LogOutResponse{
    message :String!
 }
`;

export default userTypeDef;
