$(function() {

  console.log(test.message)

  //DOM JQUERY VARIABLES
  var $question = $('#question');
  var $answersArea = $('.answersArea');
  var $questionCounter = $('#questionCounter');
  var $flashMessage = $('#flashmessage');
  var $nextQuestion = $('#nextQuestion');
  var $correctAnswers = $('#correctAnswers');
  var $categoryForm = $('#categoryForm');
  var $category = $('#category');
  var $beginQuiz = $('#beginQuiz');
  var $restart = $('#restart');
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


    //if the question count equals 0 or is equal to the 

    var urlCategory = $category.val();
    var url = 'https://opentdb.com/api.php?amount=5&type=multiple&category='+urlCategory
    console.log(url)

    fetch(url)
        .then(function(response) {
          return response.json();
        })
        .then(function(results){
          questions = results.results;
          currentQuestion = questions[questionCount];
          console.log("question results: ", questions);
          beginQuiz();
          $categoryForm.hide();
          $answersArea.show();
        })
      .catch(function(err) {
        console.log("there was an error getting the questions, try again")
      });  
    
  })

   

     //add event listeners
     $beginQuiz.on( "click", beginQuiz );

     $answersArea.children().each(function(i) { 
       $(this).on("click", checkAnswer)
     });

     $nextQuestion.on("click", nextQuestion);

     $restart.on("click", function(){
      //shows the categoryForm back, and resets the necessary variables for question count, score logic etc.
      $categoryForm.show();
      $questionCounter.html('');
      $correctAnswers.html('');
      $question.html('');
      $flashMessage.html('');
      $restart.hide();
     });



     function beginQuiz(){
        loadQuestion();
        createAnswerArray(currentQuestion);
        loadAnswer();
     }

     function checkAnswer(){
      console.log("before: ", questionCount);
      console.log("my count: ", questions.indexOf(questions[questionCount]))
      // console.log("current questions: ", currentQuestion);
      console.log("question count :", questionCount);

      if(questionCount === 0 | questionCount == questions.indexOf(currentQuestion)){

        if($(this).html() === currentQuestion.correct_answer){
          console.log("you got it correct!")
          $flashMessage.html("you got it correct!");
          correctAnswers ++;
          
          
          // $(this).attr('id', 'correctAnswer');
        } else {
          console.log("sorry you got it wrong, the correct answer is: ", currentQuestion.correct_answer)
          $flashMessage.html("sorry you got it wrong, the correct answer is: " + currentQuestion.correct_answer);
          
          // $(this).attr('id', 'incorrectAnswer');
        }
          // $flashMessage.delay(1500).fadeOut();
          // $flashMessage.html('');

          console.log("after: ", questionCount)
          $nextQuestion.show();

      } else {
        console.log("you have already answered this question click next")
        $flashMessage.html('you have already answered this question click next');
      }
     }

     function incrementQuestionCount(){
      questionCount ++;
      $questionCounter.html("Questions completed: " + questionCount);
      currentQuestion = questions[questionCount];
     }

     function nextQuestion(){

      if(questionCount + 1 != questions.length){
        $nextQuestion.hide();
        $flashMessage.html('');

          incrementQuestionCount();
          $correctAnswers.html("Correct Answers: " + correctAnswers);
          // console.log(questions[questionCount]);
          loadQuestion();
          createAnswerArray(currentQuestion);
          loadAnswer();
      } else {
        gameOver();
      }

     }

     function gameOver(){
      $flashMessage.html('quiz is over');
      $questionCounter.html("Questions completed: " + (questionCount+1));
      $question.html('quiz is over you got ' + correctAnswers + ' out of ' + questions.length + ' correct answers! click below to restart')
      questionCount = 0;
      correctAnswers = 0;
      $answersArea.hide()
      $nextQuestion.hide();
      $restart.show();
     }

     function loadQuestion(){
        $question.html(currentQuestion.question);
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
        console.log("from create answer array: ",currentQuestion)
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
