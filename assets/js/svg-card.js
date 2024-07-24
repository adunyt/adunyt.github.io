var svg_document;

function lerp(a, b, t) {
    return a + (b - a) * t;
}

function set_text_in_svg(id, text){
    let last_node = svg_document.getElementById(id);
    while (last_node.childElementCount != 0){
        last_node = last_node.firstChild;
    }
    last_node.textContent = text;
}

function set_basic_info_keys(key_list){
    let i = 1
    key_list.forEach(element => {
        set_text_in_svg(`field-${i}`, element);
        i++;
    });
}

function set_basic_info_values(value_list){
    let i = 1
    value_list.forEach(element => {
        set_text_in_svg(`value-${i}`, element);
        i++;
    });
}

function set_arrow_value(value){
    if (value > 100){
        value = 100
        console.warn("Значение переданное на ")
    }
    if (value < 0){
        value = 0
    }
    let arc_arrow = svg_document.getElementById("Arrow");
    let coord = arc_arrow.getBBox();
    let arrow_origin = (coord.x + (coord.width)) +' '+(coord.y + (coord.height));
    let arrow_angle = lerp(-90, 90, value/100)
    arc_arrow.setAttribute("transform", `rotate(${arrow_angle} ${arrow_origin})`)
}

function set_object_name(name){
    set_text_in_svg("Object-name", name);
}

function set_object_number(number){
    set_text_in_svg("Object-number", number);    
}

function set_actuality_date(date_string){
    let date = new Date(date_string)
    set_text_in_svg("Date-text", date.toLocaleString());    
}



document.getElementById("form").addEventListener("submit", function (e) {
    e.preventDefault();
  
    let formData = new FormData(e.target);
    set_object_name(formData.get("object-name"));
    set_object_number(formData.get("object-number"));
    set_actuality_date(formData.get("date-value"));
    set_arrow_value(formData.get("slider-value"));
    
    let fields_list = [];
    let values_list = [];
    for (let index = 1; index <= 5; index++) {
        fields_list.push(formData.get(`field-${index}`));
        values_list.push(formData.get(`value-${index}`));
    }
    set_basic_info_keys(fields_list);
    set_basic_info_values(values_list);
  });

window.onload = () => {
    svg_document = document.getElementById('svg-card').contentDocument;
}