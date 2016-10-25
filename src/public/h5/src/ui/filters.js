import '../vendor/switch.zepto.js'
import reqwest from 'reqwest'
window['isInFilter'] = false

function compareColor (arr1, arr2){
    let f = 0;
    for(let i=0;i<3;i++){
        f+=Math.pow(arr1[i]-arr2[i], 2)
    }
    return Math.sqrt(f) < 150
}

// isopen beacon
var sw = new Switch("checkbox2");
sw.$switchbox.click(function(event) {
    sw.setChecked(!sw.value)
    sw.userChecked = sw.value
    if(sw.value){
        console.log('open')
    } else{
        console.log('close')
    }
    main_grid.setBeaconFollow(sw.value)
});

$('#keyword').click(function(event) {
    if($('#keywordInput').hasClass('active')){
        if(sw.userChecked) {
            sw.setChecked(true)
            main_grid.setBeaconFollow(true)
        }
        main_grid.runFilter((ball) => {
            return true
        })
        isInFilter = false
        $('#keywordInput').removeClass('active')
    }else {
        $('#keywordInput').addClass('active').trigger('focus');
    }
});

$('.keyword').submit(function(event) {
    isInFilter = true
    event.preventDefault()
    sw.setChecked(false)
    main_grid.setBeaconFollow(false)
    main_grid.runFilter((ball) => {
        return ball.data.title === $('#keywordInput').val()
    })
    $('#keywordInput').val('')
    // $('#keywordInput').removeClass('active').blur();
});

$('#color').click(function(event) {
    if($('#colorList').hasClass('active')){
        $('#colorList').removeClass('active')
        $('#colorList li').removeClass('color-list-active')

        if(sw.userChecked) {
            sw.setChecked(true)
            main_grid.setBeaconFollow(true)
        }

        // sw.setChecked(false)
        // main_grid.setBeaconFollow(false)
        main_grid.runFilter((ball) => {
            return true
        })
        isInFilter = false
    } else {
        $('#colorList').addClass('active')
    }
});

$('#colorList li').click(function(event) {
    isInFilter = true
    if(!$(this).hasClass('color-list-active')){
        $('#colorList li').removeClass('color-list-active')
        $(this).addClass('color-list-active')
        let color = $(this).attr('data').split(',')
        for(let i in color){
            color.hasOwnProperty(i) && (color[i] = parseInt(color[i]))
        }
        main_grid.runFilter((ball) => {
            sw.setChecked(false)
            main_grid.setBeaconFollow(false)
            let bColor = ball.data.color.split(',')
            for(let i in bColor) {
                bColor.hasOwnProperty(i) && (bColor[i] = parseInt(bColor[i]))
            }
            return compareColor(color, bColor)
        });
    }
});

export {sw}