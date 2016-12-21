$(function() {

  //DOM JQUERY VARIABLES
  var $question           = $('#question');
  var $quizArea           = $('#quizArea');
  var $answersArea        = $('.answersArea');
  var $answers            = $(".answers");
  var $questionCounter    = $('#questionCounter');
  var $flashMessage       = $('#flashmessage');
  var $nextQuestion       = $('#nextQuestion');
  var $correctAnswers     = $('#correctAnswers');
  var $categoryForm       = $('#categoryForm');
  var $category           = $('#category');
  var $beginQuiz          = $('#beginQuiz');
  var $restart            = $('#restart');
  var $remainingQuestions = $('#remainingQuestions');

  //GLOBAL VARIABLES
  var questionCount = 0;
  var currentQuestion = {};
  var questions = [];
  var correctAnswers = 0;

  //API CALL & INITIALIZATION
  $nextQuestion.hide();
  $restart.hide();
  $answersArea.hide();

  $beginQuiz.on("click", function(){
    event.preventDefault();

    var urlCategory = $category.val();
    var url = 'https://opentdb.com/api.php?amount=5&type=multiple&category='+urlCategory

    fetch(url)
        .then(function(response) {
          return response.json();
        })
        .then(function(results){
          questions = results.results;
          currentQuestion = questions[questionCount];
          beginQuiz();
        })
      .catch(function(err) {
        console.log("there was an error getting the questions, try again")
      });  
    
    })

     //EVENT LISTENERS
     $beginQuiz.on("click", beginQuiz );

     $answersArea.children().each(function(i) { 
       $(this).on("click", checkAnswer)
     });

     $nextQuestion.on("click", nextQuestion);

     $restart.on("click", restart);

     
     //MAIN FUNCTIONS

     function beginQuiz(){
        loadQuestion();
        beginAnimations();
     }

     function nextQuestion(){
      if(questionCount + 1 != questions.length){
        $nextQuestion.hide();
        $flashMessage.html('');
        incrementQuestionCount();
        correctAnswers ++;          
        $correctAnswers.html("Correct Answers: " + correctAnswers);
        loadQuestion();
      } else {
        gameOver();
      }

     }


     function restart(){
      $categoryForm.show();
      $questionCounter.html('');
      $correctAnswers.html('');
      $question.html('');
      $flashMessage.html('');
      $restart.hide();
      $flashMessage.show();
      $questionCounter.show();
      $correctAnswers.show();
     }

    function checkAnswer(){
        if($(this).html() === currentQuestion.correct_answer){          
          $flashMessage.html("you got it correct!");          
        } else {
          $flashMessage.html("sorry you got it wrong, the correct answer is: " + currentQuestion.correct_answer);
        }   
        $nextQuestion.show();
    } 
     
    //HELPER FUNCTIONS

    function beginAnimations(){
     $categoryForm.hide();
     $question.show();
     $answersArea.delay(500).fadeIn();
    }

     function incrementQuestionCount(){
      questionCount ++;
      $questionCounter.html("Questions completed: " + questionCount);
      currentQuestion = questions[questionCount];
     }

     

     function gameOver(){
      $flashMessage.hide();
      $questionCounter.hide();
      $correctAnswers.hide();
      $question.html('quiz is over you got ' + correctAnswers + ' out of ' + questions.length + ' correct answers!')
      questionCount = 0;
      correctAnswers = 0;
      $answersArea.hide()
      $nextQuestion.hide();
      $restart.show();
     }

     function loadQuestion(){
        $question.html(currentQuestion.question);
        createAnswerArray(currentQuestion);
        loadAnswer();
     }

     function loadAnswer(){
        var answersLength = $answersArea.children().length;

        for(var i=0;i<=answersLength;i++){
          $answersArea.children().each(function(i) { 
            $(this).html(currentQuestion.answerArray[i])
          });
        }
        
     }

     function createAnswerArray(currentQuestion){
        var answerArray=[];
        for(var i=0; i<currentQuestion.incorrect_answers.length; i++){
          answerArray.push(currentQuestion.incorrect_answers[i])
        }


        answerArray.push(currentQuestion.correct_answer);
        answerArray = randomizeArray(answerArray);
        currentQuestion.answerArray = answerArray
     }


     function randomizeArray(array) {
       var currentIndex = array.length
       var temporaryValue = null
       var randomIndex = null

       // While there remain elements to randomizeArray...
       while (0 !== currentIndex) {
         // Pick a remaining element...
         randomIndex = Math.floor(Math.random() * currentIndex);
         currentIndex -= 1;
         // And swap it with the current element.
         temporaryValue = array[currentIndex];
         array[currentIndex] = array[randomIndex];
         array[randomIndex] = temporaryValue;
       }

       return array;
     }

});
