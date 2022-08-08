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

export const bannerDataStructure = [
    {label: "General Settings", type: "Heading/Separator"},

    {label: "Banner Name", type: "text", formName: "name"},

    {label: "Banner Background (Valid HTML color)", type:"color", formName: "general-background"},
    {label: "Banner orientation", type:"select", formName: "general-orientation", option_list: [{formName: "text-image",value: "Right: Text, Left: Image"}, {formName: "image-text",value: "Right: Image, Left: Text"}]},
    
    {label: "Heading Settings", type: "Heading/Separator"},

    {label: "Heading", type: "text", formName: "heading-text"}, 
    {label: "Heading Font Color (Valid HTML color)", type: "color", formName: "heading-color"},
    {label: "Heading Font Size (in px, em or rem)", type: "text", formName: "heading-fontSize"},

    {label: "Sub-Heading Settings", type: "Heading/Separator"},

    {label: "subHeading", type: "text", formName: "subHeading-text"}, 
    {label: "subHeading Font Color (Valid HTML color)", type: "color", formName: "subHeading-color"},
    {label: "subHeading Font Size (in px, em or rem)", type: "text", formName: "subHeading-fontSize"},

    {label: "Button Settings", type: "Heading/Separator"},

    {label: "button text", type: "text", formName: "button-text"}, 
    {label: "button Font Color (Valid HTML color)", type: "color", formName: "button-color"},
    {label: "button Background (Valid HTML color)", type: "color", formName: "button-background"},
    {label: "Button Redirect Link", type:"text", formName:"button-redirect"},

    {label: "Banner Image", type: "Heading/Separator"},

    {label: "Banner Image", type: "file", formName: "img"}, 
]

