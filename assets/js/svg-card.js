class SVGCard {
    svg_qyery_selector = "";
    svg_document;

    constructor(svg_qyery_selector) {
        this.svg_qyery_selector = svg_qyery_selector;
        this.svg_document = document.querySelector(svg_qyery_selector).contentDocument;    
    }    

    __lerp(a, b, t) {
        return a + (b - a) * t;
    }
    
    set_text_in_svg(id, text){
        let last_node = this.svg_document.getElementById(id);
        if (last_node === null){
            console.error(`Не найден элемент с id '${id}' в svg файле!`)
            return;
        }
        while (last_node.childElementCount != 0){
            last_node = last_node.firstChild;
        }
        last_node.textContent = text;
    }
    
    get_basic_info_rows(){
        let all_rows = [];
        let i = 1;
        let last_field = this.svg_document.getElementById(`field-${i}`);
        let last_value = this.svg_document.getElementById(`value-${i}`);
        while (last_field !== null && last_value !== null){
            all_rows.push([last_field, last_value]);
            i++;

            last_field = this.svg_document.getElementById(`field-${i}`);
            last_value = this.svg_document.getElementById(`value-${i}`);
        }
        return all_rows;
    }

    set_basic_info_row(index, field, value){
        this.set_text_in_svg(`field-${index}`, field);
        this.set_text_in_svg(`value-${index}`, value);
    }
    
    set_arrow_value(value){
        if (value > 100){
            value = 100
        }
        if (value < 0){
            value = 0
        }
        let arc_arrow = this.svg_document.getElementById("Arrow");
        let coord = arc_arrow.getBBox();
        let arrow_origin = (coord.x + (coord.width)) +' '+(coord.y + (coord.height));
        let arrow_angle = this.__lerp(-90, 90, value/100)
        arc_arrow.setAttribute("transform", `rotate(${arrow_angle} ${arrow_origin})`)
    }
    
    set_object_name(name){
        this.set_text_in_svg("Object-name", name);
    }
    
    set_object_number(number){
        this.set_text_in_svg("Object-number", number);    
    }
    
    set_actuality_date(date_string){
        let date = new Date(date_string)
        this.set_text_in_svg("Date-text", date.toLocaleString());    
    }

    set_table_titles(label_list){
        for (let index = 0; index < 3; index++) {
            this.set_text_in_svg(`Col${index+1}-label`, label_list[index])
        }
    }

    set_values_in_row(row_index, value_list){
        for (let index = 0; index < value_list.length; index++) {
            this.set_text_in_svg(`Col${row_index}-value${index+1}`, value_list[index])
        }
    }

}    

var svg_card;

document.getElementById("form").addEventListener("submit", function (e) {
    e.preventDefault();
  
    let formData = new FormData(e.target);
    svg_card.set_object_name(formData.get("object-name"));
    svg_card.set_object_number(formData.get("object-number"));
    svg_card.set_actuality_date(formData.get("date-value"));
    svg_card.set_arrow_value(formData.get("slider-value"));
    
    let svg_fields = svg_card.get_basic_info_rows();
    for (let index = 1; index <= svg_fields.length; index++) {
        let field = formData.get(`field-${index}`);
        let value = formData.get(`value-${index}`);
        svg_card.set_basic_info_row(index, field, value);
    }

    let title_list = []
    for (let index = 1; index <= 3; index++) {
        let title = formData.get(`col${index}-label`)
        title_list.push(title)
    }
    svg_card.set_table_titles(title_list)

    for (let col_index = 1; col_index <= 3; col_index++) {
        let column_values = []
        for (let row_index = 1; row_index <= 3; row_index++) {
            let value = formData.get(`col${col_index}-value${row_index}`)
            column_values.push(value)
        }
        svg_card.set_values_in_row(col_index, column_values)
    }

    svg_card.set_basic_info_keys(fields_list);
    svg_card.set_basic_info_values(values_list);
  });

window.onload = () => {
    svg_card = new SVGCard('#svg-card');
}