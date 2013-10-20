'use strict';

app.controller('CodeCtrl', function CodeCtrl($scope, $timeout, snippets, scaladoc, insight) {
  (function(){ /* Doc */

    $scope.docs = [];
    $scope.snippets = [];

    $scope.search = function(term){
      $scope.docs = scaladoc.query(term);
      $scope.snippets = snippets.query(term);
      $scope.all = $scope.docs.concat($scope.snippets);
    };

    $scope.hasDocs = function(){
      return $scope.docs.length > 0;
    };

    $scope.hasSnippets = function(){
      return $scope.snippets.length > 0;
    };

    $scope.select = function(item){
      $scope.code += '\n\n' + item.code;
      $scope.insight += '\n\n' + item.insight;
      // $scope.term = "";
    };
  })();
  
  (function(){ /* Code & Insight */
    $scope.timer = null;
    $scope.code = "";
    $scope.insightCode = "";

    /* Defining the Left and Right CodeMirroir */
    $scope.cmLeft = null;
    $scope.cmRight = null;

    $scope.options = {
      fixedGutter: false,
      lineNumbers: true,
      mode: 'text/x-scala',
      theme: 'solarized dark',
      smartIndent: false,
      autofocus: true,
      onChange: function(cm,event) {

        // $scope.insightState = 'fetching';
        // if($scope.timer) {
        //   $timeout.cancel($scope.timer);
        // }
        // $scope.timer = $timeout(function(){
        //   $scope.insightState = '';

        //   var res = [];
        //   $scope.code.split('\n').forEach(function(line){
        //     res.push(changes[line]);
        //   })
        //   $scope.insightCode = res.join('\n');

        // }, 1000);

        //$scope.insightCode = insight($scope.code);
      },
      onScroll: function(cm) {
        if ($scope.cmLeft === null) {
          $scope.cmLeft = cm;
        }

        var scrollLeftInfo = cm.getScrollInfo();
        if ($scope.cmRight !== null) {
          $scope.cmRight.scrollTo(null, scrollLeftInfo['top']);
        }
      },
      onLoad: function(cm) {
        $scope.cmLeft = cm;
      }
    };
    $scope.options2 = {
      fixedGutter: false,
      lineNumbers: true,
      mode: 'text/x-scala',
      theme: 'solarized light',
      readOnly: 'nocursor',
      onScroll: function(cm) {
        if($scope.cmRight === null) {
          $scope.cmRight = cm;
        }

        var scrollRightInfo = cm.getScrollInfo();
        if ($scope.cmLeft !== null) {
          $scope.cmLeft.scrollTo(null, scrollRightInfo['top']);
        }
      },
      onLoad: function(cm) {
        $scope.cmRight = cm;
      }
    };

    $scope.options3 = {
      mode: 'text/x-scala',
      theme: 'solarized light',
      readOnly: 'nocursor'
    };
  })();
  
  (function() { /* Insight toggling */
    $scope.insightShow = true;
    $scope.insightToggler = function() {
        $scope.insightShow = !$scope.insightShow;
    }
  })();

  (function() { /* This part of the code is for the User's behavior in the header of the site */
    $scope.userDropDownShow = false;
    $scope.onUserClick = function() {
      $scope.userDropDownShow = !$scope.userDropDownShow;
    }
  })();

  (function() { /* The showing of the Modal */
    $scope.modalShow = true;
    $scope.showSettingsModal = function() {
      $scope.modalShow = !$scope.modalShow;
    }
  })();


  (function() { /* For the fullscreen (Zen Mode) */
    $scope.isFullScreen = false;
    $scope.onZenMode = function() {
      $scope.isFullScreen = !$scope.isFullScreen;
      $scope.FullScreen.toggle();
    }

    function toggleFullScreenEvent(e, scope) {
      var code = (e.keyCode ? e.keyCode : e.which);
      if (code == 122) {
        scope.onZenMode();
      }
    }

    document.addEventListener("keyup", (function(e) {
        $scope.$apply(function () {
          toggleFullScreenEvent(e, $scope);
          console.log('keyup');
        });
    }), false);

    $scope.FullScreen = (function()
    {
            var version = "0.1";
            var events = {};
            
            function FullScreen()
            {

            }
            
            FullScreen.toggle = function(element){
                    if(FullScreen.isFullScreen())
                            return FullScreen.cancelFullScreen();
                    else
                            return FullScreen.requestFullScreen(element);
            };
            
            FullScreen.requestFullScreen = function(element)
            {
                    if(element == null)
                            element = document.documentElement;
                    
                    if (element.requestFullScreen) {
                              element.requestFullScreen();
                    } else if (element.mozRequestFullScreen) {
                              element.mozRequestFullScreen();
                    } else if (element.webkitRequestFullScreen) {
                              element.webkitRequestFullScreen();
                    }else{
                            return false;
                    }
                    return true;
            };
            
            FullScreen.cancelFullScreen = function()
            {
                    if (document.cancelFullScreen) {
                            document.cancelFullScreen();
                    } else if (document.mozCancelFullScreen) {
                              document.mozCancelFullScreen();
                    } else if (document.webkitCancelFullScreen) {
                              document.webkitCancelFullScreen();
                    }else{
                            return false;
                    }
                    return true;
            };
            
            FullScreen.isFullScreen = function(){
                    return ((document.fullScreenElement != undefined && document.fullScreenElement !== null) // HTML5 spec
                            || (document.mozFullScreen != undefined && document.mozFullScreen === true) // Mozilla
                            || (document.webkitIsFullScreen != undefined && document.webkitIsFullScreen === true)); // webkit
            };
            
            return FullScreen;
            
    })();

  })();


  (function() { /* The pace of the keyboard before sending data to the server */
    $scope.isEditorPending = false;
    $scope.editorPendingPromise = null;

    function sendDataToServer() {
      console.log('Data have been sent to the server!');
      $scope.isEditorPending = false;
      $scope.editorPendingPromise = null;
    }

    $scope.onEditorCodeChange = function() {
      console.log("changement dans l'éditeur de code.");
      if ($scope.isEditorPending && $scope.editorPendingPromise != null) {
        $timeout.cancel($scope.editorPendingPromise);
        console.log('timeout canceled.');

        $scope.editorPendingPromise = $timeout(sendDataToServer, 2000);
      } else {
        $scope.isEditorPending = true;
        $scope.editorPendingPromise = $timeout(sendDataToServer, 2000);
        console.log('starting the editor onchange timeout!');
      }
    }
  })();


});