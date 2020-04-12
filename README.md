# 1upHealth-CC

To run locally please type `npm install && npm run dev`
and visit `localhost:3000`

Once again thank you for letting me do this coding challenge. My plan of attack was to first get the flow working through postman. The 1upHealth postman collections were extremly helpful in this step. Once I got the flow of patient -> Oauth Token -> Access Code -> \$everything data, the next step was to build the api to retrive and just output the raw data.

Once I got the general flow working, the next step was converting the data to something human readable. I noticed each of the resource types for Jason Argonaut had a different structure, thus I analyzed the json data of all 305 entries and found 12 distinct types of resources. Thus I generated types for all them using a tool (as such there are a lot of overlaps in types and the naming might be weird), and using the types, I managed to map certain values that I deemed the most important to display on the front end.

API Endpoints:

URL: http://localhost:3000/api/patientInfo  
Method: GET  
Params:  
Optional:  
accessToken=[string]  
patientID=[string]  
Outputs:  
Patient Profile Info  

URL: http://localhost:3000/api/patientData  
Method: GET  
Params:  
Optional:  
skip=[number]  
accessToken=[string]  
patientID=[string]  
Outputs:  
\$Everything query with the results mapped to a {type: string, details: JSON}  
