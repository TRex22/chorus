app.AlbumView = Backbone.View.extend({

  initialize:function () {
  },

  render: function () {
    var self = this;

    this.$el.html(this.template(this.model.attributes));

    self.albumList = new app.AlbumCollection();
    self.albumList.fetch({"id": this.model.attributes.albumid, "type": "album", "success": function(data){
      self.albumsView = new app.AlbumsList({model: data, className: 'album-list'});
      var alb = data.models[0].attributes,
          sidebarSelector = '#sidebar-first .album-row-' + alb.albumid;

      $('#album-list').html(self.albumsView.render().el);

      $('#title').html('<a href="#artist/' + alb.artistid + '">' + alb.artist + '</a>' + alb.album);

      //remove any existing active
      $('#sidebar-first .album-small-row').removeClass('active');

      //check if album exists in current sidebar list and only rerender if not
      if($(sidebarSelector).length == 0){
        app.store.libraryCall(function(){

          //add the sidebar view
          self.albumArtistView = new app.AlbumArtistView({"model":data.models[0]});
          $('#sidebar-first').html(self.albumArtistView.render().el);

        }, 'albumsReady');
      } else {
        //set active row
        $(sidebarSelector).addClass('active');
      }








    }});





    return this;
  }

});



app.AlbumArtistView = Backbone.View.extend({

  tagName:"div",
  className:'album-artist-item',

  initialize:function () {
    this.artistModel = new app.Artist({"id": this.model.attributes.artistid, "fields":app.artistFields});
    this.artistAlbums = {};
  },

  render:function () {
    var self = this;


    this.artistModel.fetch({success:function(artist){

      //base template
      self.$el.html(self.template(artist.attributes));


      // set the sidebar title
      //$('#title a').html('Artists').attr('href', '#artists');

      //get the artists albums
      self.albumList = new app.AlbumCollection();
      self.albumList.fetch({"id": artist.attributes.artistid, "type": "artist", "success": function(data){
        console.log(data);
        self.albumsView = new app.SmallAlbumsList({model: data});
        $('#sidebar-first .other-albums').html(self.albumsView.render().el);

        //set active row
        $('.album-row-' + self.model.attributes.albumid).addClass('active');

        //scrollbars
        app.helpers.addScrollBar('.other-albums');
        console.log(data);
      }});

    }});

    return this;
  }

});