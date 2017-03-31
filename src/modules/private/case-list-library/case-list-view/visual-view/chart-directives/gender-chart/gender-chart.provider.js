'use strict';
angular.module('saintApp').provider('GenderService', [function () {
  return {
    '$get':['ConstantService', 'AuthorizeService', function(ConstantService, AuthorizeService){
      var gender = {};
      gender.genderChartData = null;
      gender.handleClickForGenderElement = function (element, requiredSelector, skipSVGFind, isDisabled, tempClickHandler) {
        if(AuthorizeService.hasPrivilege(ConstantService.PRIVILEGES.CASE_LIST_VISUAL_FILTER)) {
          if (!isDisabled) {
            if ($(element).closest('.dsui-disabled').length === 0) {
              var name = $(element).attr('class').split(' ')[0];
              var index = 0;
              var chartDisplayName = _.findWhere(gender.genderChartData, {'name': name.toLowerCase()});
              var data = chartDisplayName? chartDisplayName.data: {'name': name, 'isSelected': false};
              var tempElement = $(element).parent().parent().parent();
              var chartName = '';
              if (skipSVGFind) {
                chartName = tempElement.attr('class');
              } else {
                chartName = tempElement.find('svg').attr('class');
              }
              var color = $('#' + ConstantService.GENDER_CODE).find('svg').find(requiredSelector).find('g').attr('fill');
              tempClickHandler(data, index, chartName, color);
            }
          }
        }
        return gender;
      };
      gender.createGraph=function(isDisabled, chartType, id, values, valueObjects, colors, availableColors, clickHandler){
        gender.genderChartData = valueObjects;
        var tempId = new Date().getTime();
        $('#' + id).html('');
        var shapes = {
          Male: {
            Head: 'M45.6,2.8c9.3-3,19.8,7.9,15.5,17.1c-2.8,9.1-16.3,11.5-22,4C32.7,17.1,36.7,4.5,45.6,2.8L45.6,2.8z',
            Body: 'M25,33.2c8.5-3.4,17.8-1.8,26.8-2.2c7.7,0.2,16.7-1,23.1,4.4c4.8,3.7,5,10.5,5.1,16.1c0,12.3,0,24.8,0,37.3c0.2,2.8-1,7.1-4.4,7c-4.2,1-6.8-3.4-6.5-7c0-12.1,0-24,0-36.1c-1,0-3,0-4,0c-0.2,34.6,0.2,69.1-0.2,103.7c0.8,8.4-13.7,10.1-14.3,1.6c-0.4-20.6,0-41.5-0.2-62.3c-0.8,0-2.6,0-3.4,0c0,18.1,0,36.1,0,54.2c0,4-0.4,7.9-1.8,11.7c-4.8,4-13.7,2-13.3-5.1C31.3,122,31.8,87.6,31.5,53c-0.8,0-2.3,0-3.1,0c-0.2,11.5,0,22.8,0,34.4c0,3.7-1.8,9.7-6.8,8.5c-2.8,0.2-4.5-3-4.4-5.6c-0.2-14.5,0-29,0-43.5C17.1,41.1,19.6,35.2,25,33.2L25,33.2z'
          },
          Female: {
            Head: 'M153.7,2.7c8.5-1.8,17.5,6.2,15.5,14.9c-0.8,11.3-17.5,14.7-23.4,5.7C139.6,15.9,144.8,4.4,153.7,2.7L153.7,2.7z',
            Body: 'M135.8,37c6.5-6.2,16.1-3.7,24.2-4.4c6.8-0.4,14.7,0.4,18.6,6.5c4.9,8,6,17.5,9.2,26.2c1.8,7.3,5.9,14.9,4.2,22.6c-3.4,1.2-7.7,1-9.3-2.8c-3.7-10.5-6.5-21.4-10.1-31.9c-0.4-1.8-2-3-3.1-4.2c5,21.1,11.9,41.5,17.5,62.3c-5.1,0-10.4,0-15.5,0c-0.4,14.9,0.2,29.8-0.2,44.6c0,3.4-2.2,7.1-5.9,7.1c-3.7,0.2-6.4-3.4-5.9-7c-0.2-14.9,0.2-29.9-0.2-44.8c-1,0-2.8,0-3.6,0.2c-0.2,15.5,0.4,31-0.2,46.5c-0.4,7-10.9,6.8-11.7,0c-0.4-15.5,0-31-0.2-46.5c-5.1,0-10.4,0-15.5,0c5-20.5,10.5-40.7,15.5-61.2c-0.6,0.4-1.8,1.2-2.3,1.6c-3.7,10.9-6.2,22.5-9.9,33.3c-1.2,5-10.1,4.8-10.4-0.8c0.8-8.5,4.4-16.4,6.4-24.6C129.4,52.1,130.2,43.3,135.8,37L135.8,37z'
          },
          Others: {
            Body: 'M305.9,2.3v8.9h29.3l-32.1,32.5c-8.2-8.9-19.6-14.4-32.6-14.4c-24.5,0-44.4,20-44.4,44.6c0,23.3,17.6,42.3,40.2,44.6V132h-22.2v8.9h22.2v22.3h8.9V141h22.2V132h-22.2v-13.5c22.5-2.3,40.2-21.3,40.2-44.6c0-8.5-2.3-16.4-6.6-23l32.9-33.1v29.5h8.9v-45H305.9z M270.7,109.5c-19.6,0-35.6-16.1-35.6-35.8s16-35.8,35.6-35.8c19.6,0,35.6,16.1,35.6,35.8S290.3,109.5,270.7,109.5z'
          }
        };
        var showPopover = function () {
          var hoveredGender = $(this).attr('class');
          var hoverContent = null;
          if (hoveredGender.indexOf(ConstantService.MALE_TEXT) > -1) {
            hoverContent = ConstantService.MALE_TEXT + ': ' + values[0];
          } else if (hoveredGender.indexOf(ConstantService.FEMALE_TEXT) > -1) {
            hoverContent = ConstantService.FEMALE_TEXT + ': ' + values[1];
          } else if (hoveredGender.indexOf(ConstantService.OTHERS_TEXT) > -1) {
            hoverContent = ConstantService.OTHERS_TEXT + ': ' + values[2];
          }
          $(this).popover({
            placement: 'top',
            container: '#' + id,
            trigger: 'manual',
            html: true,
            content: hoverContent
          });

          $(this).popover('show');
        };

        var removePopovers = function () {
          $('.popover').each(function () {
            $(this).remove();
          });
        };
        var handleMouseOverHighlight = function (data) {
          if(data && data.data) {
            var selector = '#' + data.parentData.id + ' svg #background' + ' .' + data.data.name;
            var legendSelector = '.dsui-legend-' + data.data.name.toLowerCase();
            _.each(document.querySelectorAll(selector), function (element) {
              $(element).css('stroke', data.color.forDisplay);
              $(legendSelector).css({
                'font-size': '18px',
                'fill': data.color.forFill
              });
            });
          }
        };
        var handleMouseOutHighlight = function (data){
          if(data && data.data) {
            var selector = '#' + data.parentData.id + ' svg #background' + ' .' + data.data.name;
            var legendSelector = '.dsui-legend-' + data.data.name.toLowerCase();
            if (!data.data.isSelected) {
              _.each(document.querySelectorAll(selector), function (element) {
                $(element).css('stroke', '');
                $(legendSelector).css({
                  'font-size': '12px',
                  'fill': ConstantService.GRAPH_LEGEND_COLOR
                });
              });
            }
          }
        };
        gender.tip = d3.tip()
          .attr('class', 'd3-tip')
          .offset([-10, 0])
          .html(function () {
            var hoveredGender = $(this).attr('class');
            if (hoveredGender === ConstantService.MALE_TEXT) {
              return ConstantService.MALE_TEXT + ' = ' + values[0];
            } else if (hoveredGender === ConstantService.FEMALE_TEXT) {
              return ConstantService.FEMALE_TEXT + ' = ' + values[1];
            } else if (hoveredGender === ConstantService.OTHERS_TEXT) {
              return ConstantService.OTHERS_TEXT + ' = ' + values[2];
            }
          });
        var svg = d3.select('#' + id)
          .append('svg')
          .attr('id',tempId)
          .data(valueObjects)
          .attr({
            'x': '0px',
            'y': '0px',
            'class': chartType,
            'viewBox': '0 0 355 190',
            'enable-background': 'new 0 0 355 190',
            'xml:space': 'preserve'
          });
        svg.call(gender.tip);
        var background = svg.append('g').attr('id', 'background');

        /*Start of Male shape*/
        background.append('path')
          .data([valueObjects[0]])
          .attr({
            'd': shapes.Male.Head,
            'class': ConstantService.MALE_TEXT+' dsui-svg-hover',
            'style': valueObjects[0].data && valueObjects[0].data.isSelected? 'stroke:'+ valueObjects[0].color.forDisplay:''
          })
          .attr('fill', colors[0])
          .on('click', function () {
            gender.handleClickForGenderElement(this, '#male-overlay', false, isDisabled, clickHandler);
          }).on('touchstart', function () {
            gender.handleClickForGenderElement(this, '#male-overlay', false, isDisabled, clickHandler);
          })
          .on('mouseover', function (data) {
            handleMouseOverHighlight(data);
            showPopover.call(this);
          })
          .on('mouseout', function (data) {
            handleMouseOutHighlight(data);
            removePopovers();
          });
        background.append('path')
          .data([valueObjects[0]])
          .attr({
            'd': shapes.Male.Body,
            'class': ConstantService.MALE_TEXT+' dsui-svg-hover',
            'style': valueObjects[0].data && valueObjects[0].data.isSelected? 'stroke:'+ valueObjects[0].color.forDisplay:''
          })
          .attr('fill', colors[0])
          .on('click', function () {
            gender.handleClickForGenderElement(this, '#male-overlay', false, isDisabled, clickHandler);
          }).on('touchstart', function () {
            gender.handleClickForGenderElement(this, '#male-overlay', false, isDisabled, clickHandler);
          })
          .on('mouseover', function (data) {
            handleMouseOverHighlight(data);
            showPopover.call(this);
          })
          .on('mouseout', function (data) {
            handleMouseOutHighlight(data);
            removePopovers();
          });
        /*End of Male shape*/

        /*Start of female shape*/
        background.append('path')
          .data([valueObjects[1]])
          .attr({
            'd': shapes.Female.Head,
            'class': ConstantService.FEMALE_TEXT+' dsui-svg-hover',
            'style': valueObjects[1].data && valueObjects[1].data.isSelected? 'stroke:'+ valueObjects[1].color.forDisplay:''
          })
          .attr('fill', colors[1])
          .on('click', function () {
            gender.handleClickForGenderElement(this, '#female-overlay', false, isDisabled, clickHandler);
          }).on('touchstart', function () {
            gender.handleClickForGenderElement(this, '#female-overlay', false, isDisabled, clickHandler);
          })
          .on('mouseover', function (data) {
            handleMouseOverHighlight(data);
            showPopover.call(this);
          })
          .on('mouseout', function (data) {
            handleMouseOutHighlight(data);
            removePopovers();
          });
        background.append('path')
          .data([valueObjects[1]])
          .attr({
            'd': shapes.Female.Body,
            'class': ConstantService.FEMALE_TEXT+' dsui-svg-hover',
            'style': valueObjects[1].data && valueObjects[1].data.isSelected? 'stroke:'+ valueObjects[1].color.forDisplay:''
          })
          .attr('fill', colors[1])
          .on('click', function () {
            gender.handleClickForGenderElement(this, '#female-overlay', false, isDisabled, clickHandler);
          }).on('touchstart', function () {
            gender.handleClickForGenderElement(this, '#female-overlay', false, isDisabled, clickHandler);
          })
          .on('mouseover', function (data) {
            handleMouseOverHighlight(data);
            showPopover.call(this);
          })
          .on('mouseout', function (data) {
            handleMouseOutHighlight(data);
            removePopovers();
          });
        /*End of female shape*/

        /*Start of others shape*/
        background.append('path')
          .data([valueObjects[2]])
          .attr({
            'd': shapes.Others.Body,
            'class': ConstantService.OTHERS_TEXT+' dsui-svg-hover',
            'style': valueObjects[2].data && valueObjects[2].data.isSelected? 'stroke:'+ valueObjects[2].color.forDisplay:''
          })
          .attr('fill', colors[2])
          .on('click', function () {
            gender.handleClickForGenderElement(this, '#others-overlay', false, isDisabled, clickHandler);
          }).on('touchstart', function () {
            gender.handleClickForGenderElement(this, '#others-overlay', false, isDisabled, clickHandler);
          })
          .on('mouseover', function (data) {
            handleMouseOverHighlight(data);
            showPopover.call(this);
          })
          .on('mouseout', function (data) {
            handleMouseOutHighlight(data);
            removePopovers();
          });
        /*End of others shape*/

        /*Start of counts*/
        svg.append('text')
          .attr('x', '33')
          .attr('y', '185')
          .attr('class','dsui-chart-legend dsui-legend-'+ConstantService.MALE_TEXT.toLowerCase())
          .text(values[0]);
        svg.append('text')
          .attr('x', '142')
          .attr('y', '185')
          .attr('class','dsui-chart-legend dsui-legend-'+ConstantService.FEMALE_TEXT.toLowerCase())
          .text(values[1]);
        svg.append('text')
          .attr('x', '260')
          .attr('y', '185')
          .attr('class','dsui-chart-legend dsui-legend-'+ConstantService.OTHERS_TEXT.toLowerCase())
          .text(values[2]);
        /*End of counts*/

        //Male section
        var maleOverlay = svg.append('g')
          .attr('id', 'male-overlay');
        var maleClipRect = maleOverlay.append('defs')
          .append('rect')
          .attr('id', 'male-clip-rect')
          .attr('x', '7.9')
          .attr('y', 165)
          .attr('width', '82.4')
          .attr('height', '165');
        maleOverlay.append('clipPath')
          .attr('id', 'male-clip-path')
          .append('use')
          .attr('xlink:href', '#male-clip-rect')
          .attr('overflow', 'visible');
        var maleOverlayShape = maleOverlay.append('g')
          .attr('clip-path', 'url(#male-clip-path)')
          .attr('fill', availableColors[0]);
        maleOverlayShape.append('path')
          .data([valueObjects[0]])
          .attr({
            'd': shapes.Male.Head,
            'class': ConstantService.MALE_TEXT+' dsui-svg-hover'
          })
          .on('click', function () {
            gender.handleClickForGenderElement(this, '#male-overlay', true, isDisabled, clickHandler);
          }).on('touchstart', function () {
            gender.handleClickForGenderElement(this, '#male-overlay', true, isDisabled, clickHandler);
          })
          .on('mouseover', function (data) {
            handleMouseOverHighlight(data);
            showPopover.call(this);
          })
          .on('mouseout', function (data) {
            handleMouseOutHighlight(data);
            removePopovers();
          });

        maleOverlayShape.append('path')
          .data([valueObjects[0]])
          .attr({
            'd': shapes.Male.Body,
            'class': ConstantService.MALE_TEXT+' dsui-svg-hover'
          })
          .on('click', function () {
            gender.handleClickForGenderElement(this, '#male-overlay', true, isDisabled, clickHandler);
          }).on('touchstart', function () {
            gender.handleClickForGenderElement(this, '#male-overlay', true, isDisabled, clickHandler);
          })
          .on('mouseover', function (data) {
            handleMouseOverHighlight(data);
            showPopover.call(this);
          })
          .on('mouseout', function (data) {
            handleMouseOutHighlight(data);
            removePopovers();
          });

        //Female section
        var femaleOverlay = svg.append('g')
          .attr('id', 'female-overlay');
        var femaleClipRect = femaleOverlay.append('defs')
          .append('rect')
          .attr('id', 'female-clip-rect')
          .attr('x', '115.2')
          .attr('y', 165)
          .attr('width', '86.4')
          .attr('height', '165');
        femaleOverlay.append('clipPath')
          .attr('id', 'female-clip-path')
          .append('use')
          .attr('xlink:href', '#female-clip-rect')
          .attr('overflow', 'visible');
        var femaleOverlayShape = femaleOverlay.append('g')
          .attr('clip-path', 'url(#female-clip-path)')
          .attr('fill', availableColors[1]);
        femaleOverlayShape.append('path')
          .data([valueObjects[1]])
          .attr({
            'd': shapes.Female.Head,
            'class': ConstantService.FEMALE_TEXT+' dsui-svg-hover'
          })
          .on('click', function () {
            gender.handleClickForGenderElement(this, '#female-overlay', true, isDisabled, clickHandler);
          }).on('touchstart', function () {
            gender.handleClickForGenderElement(this, '#female-overlay', true, isDisabled, clickHandler);
          })
          .on('mouseover', function (data) {
            handleMouseOverHighlight(data);
            showPopover.call(this);
          })
          .on('mouseout', function (data) {
            handleMouseOutHighlight(data);
            removePopovers();
          });
        femaleOverlayShape.append('path')
          .data([valueObjects[1]])
          .attr({
            'd': shapes.Female.Body,
            'class': ConstantService.FEMALE_TEXT+' dsui-svg-hover'
          })
          .on('click', function () {
            gender.handleClickForGenderElement(this, '#female-overlay', true, isDisabled, clickHandler);
          }).on('touchstart', function () {
            gender.handleClickForGenderElement(this, '#female-overlay', true, isDisabled, clickHandler);
          })
          .on('mouseover', function (data) {
            handleMouseOverHighlight(data);
            showPopover.call(this);
          })
          .on('mouseout', function (data) {
            handleMouseOutHighlight(data);
            removePopovers();
          });

        //Others section
        var othersOverlay = svg.append('g')
          .attr('id', 'others-overlay');
        var othersClipRect = othersOverlay.append('defs')
          .append('rect')
          .attr('id', 'others-clip-rect')
          .attr('x', '216')
          .attr('y', '165')
          .attr('width', '132')
          .attr('height', '165');
        othersOverlay.append('clipPath')
          .attr('id', 'others-clip-path')
          .append('use')
          .attr('xlink:href', '#others-clip-rect')
          .attr('overflow', 'visible');
        var othersOverlayShape = othersOverlay.append('g')
          .attr('clip-path', 'url(#others-clip-path)')
          .attr('fill', availableColors[2]);
        othersOverlayShape.append('path')
          .data([valueObjects[2]])
          .attr({
            'd': shapes.Others.Body,
            'class': ConstantService.OTHERS_TEXT+' dsui-svg-hover',
            'width': '80',
            'height': '100'
          })
          .on('click', function () {
            gender.handleClickForGenderElement(this, '#others-overlay', true, isDisabled, clickHandler);
          }).on('touchstart', function () {
            gender.handleClickForGenderElement(this, '#others-overlay', true, isDisabled, clickHandler);
          })
          .on('mouseover', function (data) {
            handleMouseOverHighlight(data);
            showPopover.call(this);
          })
          .on('mouseout', function (data) {
            handleMouseOutHighlight(data);
            removePopovers();
          });
        maleClipRect.transition()
          .duration(0)
          .attrTween('y', function (d, i, a) {
            return d3.interpolate(a, (1 - valueObjects[0].percent) * 165);
          });
        femaleClipRect.transition()
          .duration(0)
          .attrTween('y', function (d, i, a) {
            return d3.interpolate(a, (1 - valueObjects[1].percent) * 165);
          });
        othersClipRect.transition()
          .duration(0)
          .attrTween('y', function (d, i, a) {
            return d3.interpolate(a, (1 - valueObjects[2].percent) * 165);
          });
      };
      return gender;
    }]
  };
}]);
