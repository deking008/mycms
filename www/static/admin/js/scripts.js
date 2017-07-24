(function() {
    "use strict";






    // Toggle Left Menu
    jQuery('.menu-list > a').click(function() {

        var parent = jQuery(this).parent();
        var sub = parent.find('> ul');

        if (!jQuery('body').hasClass('left-side-collapsed')) {
            if (sub.is(':visible')) {
                sub.slideUp(200, function() {
                    parent.removeClass('nav-active');
                    jQuery('.main-content').css({ height: '' });
                    mainContentHeightAdjust();
                });
            } else {
                visibleSubMenuClose();
                parent.addClass('nav-active');
                sub.slideDown(200, function() {
                    mainContentHeightAdjust();
                });
            }
        }
        return false;
    });

    function visibleSubMenuClose() {
        jQuery('.menu-list').each(function() {
            var t = jQuery(this);
            if (t.hasClass('nav-active')) {
                t.find('> ul').slideUp(200, function() {
                    t.removeClass('nav-active');
                });
            }
        });
    }

    function mainContentHeightAdjust() {
        // Adjust main content height
        var docHeight = jQuery(document).height();
        if (docHeight > jQuery('.main-content').height())
            jQuery('.main-content').height(docHeight);
    }

    //  class add mouse hover
    jQuery('.custom-nav > li').hover(function() {
        jQuery(this).addClass('nav-hover');
    }, function() {
        jQuery(this).removeClass('nav-hover');
    });


    // Menu Toggle
    jQuery('.toggle-btn').click(function() {

        if ($('body').hasClass('left-side-collapsed')) {}
        var body = jQuery('body');
        var bodyposition = body.css('position');

        if (bodyposition != 'relative') {

            if (!body.hasClass('left-side-collapsed')) {
                body.addClass('left-side-collapsed');
                jQuery('.custom-nav ul').attr('style', '');

                jQuery(this).addClass('menu-collapsed');

            } else {
                body.removeClass('left-side-collapsed chat-view');
                jQuery('.custom-nav li.active ul').css({ display: 'block' });

                jQuery(this).removeClass('menu-collapsed');

            }
        } else {

            if (body.hasClass('left-side-show'))
                body.removeClass('left-side-show');
            else
                body.addClass('left-side-show');

            mainContentHeightAdjust();
        }

    });


    searchform_reposition();

    jQuery(window).resize(function() {

        if (jQuery('body').css('position') == 'relative') {

            jQuery('body').removeClass('left-side-collapsed');

        } else {

            jQuery('body').css({ left: '', marginRight: '' });
        }

        searchform_reposition();

    });

    function searchform_reposition() {
        if (jQuery('.searchform').css('position') == 'relative') {
            jQuery('.searchform').insertBefore('.left-side-inner .logged-user');
        } else {
            jQuery('.searchform').insertBefore('.menu-right');
        }
    }

    // panel collapsible
    $('.panel .tools .fa').click(function() {
        var el = $(this).parents(".panel").children(".panel-body");
        if ($(this).hasClass("fa-chevron-down")) {
            $(this).removeClass("fa-chevron-down").addClass("fa-chevron-up");
            el.slideUp(200);
        } else {
            $(this).removeClass("fa-chevron-up").addClass("fa-chevron-down");
            el.slideDown(200);
        }
    });

    $('.todo-check label').click(function() {
        $(this).parents('li').children('.todo-title').toggleClass('line-through');
    });

    $(document).on('click', '.todo-remove', function() {
        $(this).closest("li").remove();
        return false;
    });




    // panel close
    $('.panel .tools .fa-times').click(function() {
        $(this).parents(".panel").parent().remove();
    });



    // tool tips

    $('.tooltips').tooltip();

    // popovers

    $('.popovers').popover();


    /*
    username=deking897&password=123456&repassword=123456&email=12412314%40qq.com&mobile=1342623423432&groupid=2&score=24&is_admin=1&role_id=2&vip=1&overduedate=2017-07-21+07%3A54

    */

    // ajax modal
    $(document).on('click', '[data-toggle="ajaxModal"]',
        function(e) {
            $('#ajaxModal').remove();
            e.preventDefault();
            var $this = $(this),
                $remote = $this.data('remote') || $this.attr('href'),
                $modal = $('<div class="modal fade" id="ajaxModal"><div class="modal-body"></div></div>');
            $('body').append($modal);
            $modal.modal();
            $modal.load($remote);
        }
    );

    //ajax get请求
    /**
     * <a href="#" class="text-info confirm ajax-get" >删除</a></td>
     *
     */
    $(document).on('click', '.ajax-get', function(e) {
        e.preventDefault();
        var target;
        var that = this;
        if ($(this).hasClass('confirm')) {
            if (!confirm('确认要执行该操作吗?')) {
                return false;
            }
        }
        if ((target = $(this).attr('href')) || (target = $(this).attr('url'))) {
            $.get(target).success(function(data) {

                if (data.errno == 0) {
                    new $.zui.Messager(data.data.name, {
                        type: 'success',
                        time: 1500
                    }).show();
                    setTimeout(function() {
                        location.reload();
                    }, 1500);
                } else {

                }

            });
        }
    });
    /**
     * ajax post submit请求
     * <form class = "form-horizontal">
     * <button target-form="form-horizontal" type="submit" class="ajax-post">确定</button>
     * confirm,
     */
    function ajaxpost(e) {
        e.preventDefault();
        var target, query, form;
        var target_form = $(this).attr('target-form');
        var that = this;
        var nead_confirm = false;
        if (($(this).attr('type') == 'submit') || (target = $(this).attr('href')) || (target = $(this).attr('url'))) {

            form = $('.' + target_form);
            if (form.get(0).nodeName == undefined) {
                return false;
            } else if (form.get(0).nodeName == 'FORM') {
                //表单验证
                if ($('[data-validate="parsley"]')) {
                    var validate_res = $('[data-validate="parsley"]').parsley().validate();
                    if (true !== validate_res) {
                        return false;
                    }
                }
                target = form.get(0).action;
                query = form.serialize();
                
            } else if (form.get(0).nodeName == 'INPUT' || form.get(0).nodeName == 'SELECT' || form.get(0).nodeName == 'TEXTAREA') {
                form.each(function(k, v) {
                    if (v.type == 'checkbox' && v.checked == true) {
                        nead_confirm = true;
                    }
                    query = form.serialize();
                });
            }

            $.post(target, query).success(function(data) {
                    if (data.errno == 0) {
                        new $.zui.Messager(data.data.name, {
                            type: 'success',
                            time: 1500
                        }).show();
                        setTimeout(function() {
                            location.reload();
                        }, 1500);
                    } else {
                        //else
                    }
                });
        }
    }
    $(document).on('click', '.ajax-post', ajaxpost);



    // table select/deselect all
    $(document).on('change', 'table thead [type="checkbox"]', function(e) {
        e && e.preventDefault();
        var $table = $(e.target).closest('table'),
            $checked = $(e.target).is(':checked');
        $('tbody [type="checkbox"]', $table).prop('checked', $checked);
    });


})(jQuery);
