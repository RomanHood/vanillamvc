var app = app || {};

app.main = (function () {
  var elements = {
    noteField: document.querySelector(".write-note"),
    noteSubmit: document.querySelector(".submit-note"),
    noteList: document.querySelector(".notes"),
    noNotesFound: document.querySelector(".no-notes-found")
  };

  var notes = [];



  var addAsFirstChild = function (parent, child) {
    var parentNode = parent,
      childNode = child;
    if (parentNode.firstChild) {
      parentNode.insertBefore(child, parent.firstChild);
    } else {
      parentNode.appendChild(child);
    }
  };

  var view = function (note, containerEl) {
    var index = notes.indexOf(note);
    var note = note;

    return {
      render: function () {
        this.listItem = document.createElement("li");
        this.paragraph = document.createElement("p");
        this.actions = document.createElement("ul");
        this.removeButton = document.createElement("li");
        this.likeButton = document.createElement("li");

        this.listItem.classList.add("note");
        this.actions.classList.add("actions");
        this.removeButton.classList.add("remove", "icon-cancel");
        this.likeButton.classList.add("like", "icon-heart");

        this.paragraph.innerHTML = note.data.noteBodyText;
        this.actions.appendChild(this.removeButton);
        this.actions.appendChild(this.likeButton);
        this.listItem.appendChild(this.paragraph);
        this.listItem.appendChild(this.actions);

        if (note.data.liked) {
          this.likeButton.classList.add("liked");
        }

        addAsFirstChild(elements.noteList, this.listItem);
        elements.noNotesFound.classList.add("hidden");

        return this;
      },
      like: function () {
        note.like();
        this.likeButton.classList.toggle("liked");
      },
      remove: function () {
        elements.noteList.removeChild(that.listItem);
        note.remove();
        if (elements.noteList.childElementCount === 0) {
          elements.noNotesFound.classLIst.remove("hidden");
        }
      },
      attachEvents: function () {
        this.likeButton.addEventListener("click", this.like);
        this.removeButton.addEventListener("click", this.remove);
      },
      init: function  () {
        this.render();
        this.attachEvents();
        return this;
      }
    };
  }



  var model = function (noteData, collection) {
    return {
      data: noteData,
      save: function () {
        collection.push(this.data);
        localStorage.setItem("notes", JSON.stringify(collection));
        return this;
      },
      like: function () {
        this.data.liked = !this.data.liked;
        var indexToUpdate = collection.indexOf(this.data);
        collection.splice(indexToUpdate, 1, this.data);
        localStorage.setItem("notes", JSON.stringify(collection));
        return this;
      },
      remove: function () {
        var indexToRemove = collection.indexOf(this.data);
        collection.splice(indexToRemove, 1);
        locatStorage.setItem("notes", JSON.stringify(collection));
        return this;
      }
    };
  }


  var attachEvents = function () {
    elements.noteSubmit.addEventListener("click", function (event) {
      event.preventDefault();
      var fieldNote = elements.noteField.value;
      var newNote = model({noteBodyText: fieldNote, like: false}, notes).save();
      console.log(newNote);
      view(newNote, elements.noteList).init();

      elements.noteField.value = "";
    });
  };

  var initialRender = function () {
    if (("notes" in localStorage) && JSON.parse(localStorage.getItem("notes")).length > 0) {
      notes = JSON.parse(localStorage.getItem("notes")).slice();

      var i = 0,
        len = notes.length,
        loadedNote;

      for (i; i < len; i++) {
        loadedNoted = model(notes[i], notes);
        view(loadedNote, elements.noteList).init();
      } 
    } else {
      elements.noNotesFound.classList.remove("hidden");
    }
  };

  var init = function () {
    console.log("App initialized");
    attachEvents();        
    initialRender();
  };

  return {
    init: init,
    notes: notes
  };
})();

window.addEventListener("DOMContentLoaded", app.main.init);

