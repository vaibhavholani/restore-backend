export const teamDataStructure = [
    {label: "Member Title", type: "text", formName: "title", required: true},
    {label: "Member Name", type: "text", formName: "name", required: true},
    {label: "Member Description", type: "text", formName: "description", required: true},
    {label: "Proile Image", type: "file", formName: "img", required: true},
    {label: "Member Category", type:"select", formName: "category", option_list: [{value: "Team Lead", formName: "lead"}, {value:"Collaborating Scientists", formName: "colab_sci"}, {value:"Volunteers", formName: "volunteers"}, {value:"Trainees/Work-Study Students/ Co-op Students", formName: "student",required: true}]}
]

export const projectDataStructure = [
    {label: "Project Title", type: "text", formName: "title", required: true},
    {label: "Project Description", type: "text", formName: "desc", required: true},
    {label: "Project Funder", type: "text", formName: "funder", required: true},
    {label: "Project Short Name (for Navbar display):", type: "text", formName:"short_navbar_title", required: true},
    {label: "Project Image", type: "file", formName: "img", required: true}, 
    {label: "Display Addtional Button", type:"select", formName: "displayButton", option_list: [{formName: "False",value: "False"}, {formName: "True",value: "True"}], required: false},
    {label: "Button Text", formName: "buttonText", type: "text",required: false},
    {label: "Button Click Action", formName: "buttonType", type: "select", option_list: [{formName: "link",value: "Go to a link"}, {formName: "pdf",value: "Download a stored pdf"}], required: false},
    {label: "Button Link", formName: "buttonLink", type: "text",required: false},
    {label: "PDF file", formName: "buttonDownload", type: "file", required: false},
]

export const bannerDataStructure = [
    {label: "General Settings", type: "Heading/Separator"},

    {label: "Banner Name", type: "text", formName: "name", required: true},

    {label: "Banner Background (Valid HTML color)", type:"color", formName: "general-background", required: true},
    {label: "Banner orientation", type:"select", formName: "general-orientation", option_list: [{formName: "text-image",value: "Right: Text, Left: Image"}, {formName: "image-text",value: "Right: Image, Left: Text"}], required: true},
    
    {label: "Heading Settings", type: "Heading/Separator"},

    {label: "Heading", type: "text", formName: "heading-text", required: true}, 
    {label: "Heading Font Color (Valid HTML color)", type: "color", formName: "heading-color", required: true},
    {label: "Heading Font Size (in px, em or rem)", type: "text", formName: "heading-fontSize", required: true},

    {label: "Sub-Heading Settings", type: "Heading/Separator"},

    {label: "subHeading", type: "text", formName: "subHeading-text", required: true}, 
    {label: "subHeading Font Color (Valid HTML color)", type: "color", formName: "subHeading-color", required: true},
    {label: "subHeading Font Size (in px, em or rem)", type: "text", formName: "subHeading-fontSize", required: true},

    {label: "Button Settings", type: "Heading/Separator"},

    {label: "button text", type: "text", formName: "button-text", required: true}, 
    {label: "button Font Color (Valid HTML color)", type: "color", formName: "button-color", required: true},
    {label: "button Background (Valid HTML color)", type: "color", formName: "button-background", required: true},
    {label: "Button Redirect Link", type:"text", formName:"button-redirect", required: true},

    {label: "Banner Image", type: "Heading/Separator"},

    {label: "Banner Image", type: "file", formName: "img", required: true}, 
]

