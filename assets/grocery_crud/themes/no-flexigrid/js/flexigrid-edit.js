$(function(){

	var save_and_close = false;

	$('.ptogtitle').click(function(){
		if($(this).hasClass('vsble'))
		{
			$(this).removeClass('vsble');
			$('#main-table-box #crudForm').slideDown("slow");
		}
		else
		{
			$(this).addClass('vsble');
			$('#main-table-box #crudForm').slideUp("slow");
		}
	});

	$('#save-and-go-back-button').click(function(){
		save_and_close = true;

		$('#crudForm').trigger('submit');
	});

	$('#crudForm').submit(function(){
		var my_crud_form = $(this);

		$(this).ajaxSubmit({
			url: validation_url,
			dataType: 'json',
			cache: 'false',
			beforeSend: function(){
				$("#FormLoading").show();
			},
			success: function(data){
				$("#FormLoading").hide();
				if(data.success)
				{
					$('#crudForm').ajaxSubmit({
						dataType: 'text',
						cache: 'false',
						beforeSend: function(){
							$("#FormLoading").show();
						},
						success: function(result){

							$("#FormLoading").fadeOut("slow");
							data = $.parseJSON( result );
							if(data.success)
							{
								var data_unique_hash = my_crud_form.closest(".flexigrid").attr("data-unique-hash");

								$('.flexigrid[data-unique-hash='+data_unique_hash+']').find('.ajax_refresh_and_loading').trigger('click');

								if(save_and_close)
								{
									if ($('#save-and-go-back-button').closest('.ui-dialog').length === 0) {
										window.location = data.success_list_url;
									} else {
										$(".ui-dialog-content").dialog("close");
										success_message(data.success_message);
									}

									return true;
								}

								form_success_message(data.success_message);
							}
							else
							{
								form_error_message(message_update_error);
							}
						},
						error: function(){
							form_error_message( message_update_error );
						}
					});
				}
				else
				{
					$('.field_error').each(function(){
						$(this).removeClass('field_error');
					});
					$('#report-error').slideUp('fast');
					$('#report-error').html(data.error_message);
					$.each(data.error_fields, function(index,value){
						$('input[name='+index+']').addClass('field_error');
					});

					$('#report-error').slideDown('normal');
					$('#report-success').slideUp('fast').html('');

				}
			},
			error: function(){
				alert( message_update_error );
				$("#FormLoading").hide();

			}
		});
		return false;
	});

	if( $('#cancel-button').closest('.ui-dialog').length === 0 ) {

		$('#cancel-button').click(function(){
			if( $(this).hasClass('back-to-list') || confirm( message_alert_edit_form ) )
			{
				window.location = list_url;
			}

			return false;
		});

	}
});

// addition by gofrendi
function add_form_control_class(){
    $('.flexigrid input, .flexigrid select').addClass('form-control');
}
$(document).ready(function(){
    add_form_control_class();

    // make multi select shown as it should be
    $('.ui-helper-clearfix, .ui-helper-clearfix .selected, .ui-helper-clearfix .available').css('width','auto');
    $('.ui-helper-clearfix .selected ul, .ui-helper-clearfix .available ul').css('height','110px');
    // add & delete on detail table
    $('.fbutton .add').prepend('<i class="glyphicon glyphicon-plus-sign"></i> ');
    $('.fbutton .add').addClass('btn btn-default');
    $('.fbutton .add').live('click', function(){
        $('.delete-icon').each(function(){
            if($(this).html() == ''){
                $(this).addClass('btn btn-default');
                $(this).html('<i class="glyphicon glyphicon-minus-sign"></i>');
            }
        });
    });

});
$(document).ajaxComplete(function(){
    add_form_control_class();
});
