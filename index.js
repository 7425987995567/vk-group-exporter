VK.init({
	apiId: 1
});

VK.Auth.login(function(obj) {
	VK.Api.call('groups.get', {userid: obj.session.mid}, function (r) {
		var chunks = [];
		// console.log(obj);
		for (var i = 0; i < r.response.length; i+=500) {
			chunks.push(r.response.slice(i, i+500).join(','));
		}
		// console.log(r);
		var fields = "members_count,
		status,
		deactivated,
		admin_level,
		activity,
		age_limits,
		can_message,
		can_post,
		can_see_all_posts,
		city,
		contacts,
		country,
		description,
		is_favorite,
		is_hidden_from_feed,
		is_messages_blocked,
		links,
		member_status,
		place,
		public_date_label,
		site,
		start_date,
		finish_date,
		trending,
		verified";
		
		function build_table() {

		}

		function at_last(all_group_data) {
			var beauty_json = JSON.stringify(all_group_data, null, 2);
			// console.log(beauty_json.length);
			var blob = new Blob([beauty_json], {type:"octet/stream"});
			var url = window.URL.createObjectURL(blob);
			var anchor = document.createElement('a');
			anchor.href = url;
			anchor.target = "_blank";
			// console.log('аываы');
			anchor.download = obj.session.user.first_name + "-" + obj.session.user.last_name + "-groups-json-ts"+Date.now()+".json";
			anchor.click();
			var beauty_text = "";
			beauty_text += "Группы, на которые ты подписан(а), ";
			beauty_text += obj.session.user.first_name + " " + obj.session.user.last_name + " ";
			beauty_text += "\r\n(https://vk.com/id" + obj.session.user.id + " / ";
			beauty_text += obj.session.user.href + ")\r\n";
			beauty_text += "на момент " + Date.now() + "\r\n";
			beauty_text += "---------------\r\n";

			for(var i = 0; i < all_group_data.length; i++) {
				beauty_text += (i + 1) + ". Группа " + all_group_data[i].name + "\r\n";
				beauty_text += "\tВечная ссылка на неё: https://vk.com/club" + all_group_data[i].gid + "\r\n"; 
				beauty_text += "\tНевечная ссылка на неё: https://vk.com/" + all_group_data[i].screen_name + "\r\n"; 
				beauty_text += "\tЗакрытая группа?: " + (all_group_data[i].is_closed ? "да" : "нет") + "\r\n"; 
				beauty_text += "\tТип группы: " + (all_group_data[i].type === "group" ? "группа" : all_group_data[i].type === "page" ? "паблик" : "встреча") + "\r\n";
				beauty_text += "\tТы подписан на неё?: " + (all_group_data[i].is_member ? "да" : "нет") + "\r\n";
				beauty_text += "\tТы адмен в ней?: " + (all_group_data[i].is_admin ? "да" : "нет") + "\r\n";
				beauty_text += "\r\n";

				beauty_text += "\tКоличество подписчиков: " + all_group_data[i].members_count + "\r\n";
				beauty_text += "\tСтатус: \"" + all_group_data[i].status + "\"\r\n";
				beauty_text += "\tЗаблокировано?: \"" + (all_group_data[i].deactivated ? "да" : "нет") + "\r\n";
				if (all_group_data[i].admin_level) beauty_text += "\tЗаблокировано?: \"" + (all_group_data[i].deactivated ? "да" : "нет") + "\r\n";
			};

			beauty_text += "\r\n";
			blob = new Blob([beauty_text], {type:"text/csv"});
			url = window.URL.createObjectURL(blob);
			anchor = document.createElement('a');
			anchor.href = url;
			anchor.target = "_blank";
			anchor.download = obj.session.user.first_name + "-" + obj.session.user.last_name + "-groups-text-ts"+Date.now()+".txt";
			anchor.click();

			build_table();
		};

		var data = [];
		function chunk_counter(data_received) {
			if (data_received) {
				data = data.concat(data_received);
			}
			if(!chunks.length) {
				return at_last(data);
			} 
			asynch_chunk_call(chunks.splice(0, 1));
		}

		function asynch_chunk_call(chunk) {
			VK.Api.call('groups.getById', {
				group_ids: chunk, 
				fields: fields,
				access_token: obj.session.access_token
			}, function (r) {
				chunk_counter(r.response);
    		});
		}
    	
    	chunk_counter();
	})
}, 262144 /* group access bitmask */);