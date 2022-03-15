export const teamDataStructure = [
    {label: "Member Title", type: "text", formName: "title"},
    {label: "Member Name", type: "text", formName: "name"},
    {label: "Member Description", type: "text", formName: "description"},
    {label: "Proile Image", type: "file", formName: "img"}, 
    {label: "Member Category", type:"select", formName: "category", option_list: [{value: "Team Lead", formName: "lead"}, {value:"Collaborating Scientists", formName: "colab_sci"}, {value:"Volunteers", formName: "volunteers"}, {value:"Trainees/Work-Study Students/ Co-op Students", formName: "student"}]}
]

export const projectDataStructure = [
    {label: "Project Title", type: "text", formName: "title"},
    {label: "Project Description", type: "text", formName: "desc"},
    {label: "Project Funder", type: "text", formName: "funder"},
    {label: "Project Short Name (for Navbar display):", type: "text", formName:"short_navbar_title"},
    {label: "Project Image", type: "file", formName: "img"}, 
]