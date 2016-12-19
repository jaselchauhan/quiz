$(function() {

  var $beginQuiz = $('#beginQuiz');
  var $question = $('#question');
  var $answersArea = $('.answersArea');
  var $questionCounter = $('#questionCounter');
  var $flashMessage = $('#flashmessage');
  var $nextQuestion = $('#nextQuestion');

   
  var questionCount = 0;
  var currentQuestion = {};
  var questions = [];

  // $beginQuiz.hide();

  fetch('https://opentdb.com/api.php?amount=4')
      .then(function(response) {
        return response.json();
      })
      .then(function(results){
        questions = results.results
        console.log("question results: ", questions);
        // $beginQuiz.show(); currentQuestion = questions[questionCount];
        currentQuestion = questions[questionCount];
        //add event listeners
        $beginQuiz.on( "click", beginQuiz );

      })
    .catch(function(err) {
      console.log("there was an error")
    });   

    // console.log("results from apiCall function: ", apiCall);

    var questions = [
      {"category":"Geography","type":"multiple","difficulty":"hard","question":"Which of these countries is NOT a part of the Asian continent?","correct_answer":"Suriname","incorrect_answers":["Georgia","Russia","Singapore"]},
      {"category":"History","type":"multiple","difficulty":"easy","question":"Which one of these tanks was designed and operated by the United Kingdom?","correct_answer":"Tog II","incorrect_answers":["M4 Sherman","Tiger H1","T-34"]},
      {"category":"Entertainment: Video Games","type":"multiple","difficulty":"easy","question":"Blinky, Pinky, Inky and Clyde are characters from which classic video game?","correct_answer":"Pac-Man","incorrect_answers":["Gauntlet","Space Invaders","Street Fighter"]},
      {"category":"Entertainment: Musicals & Theatres","type":"multiple","difficulty":"medium","question":"In which Shakespeare play does the character Marcellus say, &quot;Something is rotten in the state of Denmark&quot;?","correct_answer":"Hamlet","incorrect_answers":["Macbeth","King Lear","Twelfth Night"]}
      ]

    

     

     $answersArea.children().each(function(i) { 
       $(this).on("click", checkAnswer)
     });

     $nextQuestion.on("click", nextQuestion)

     $nextQuestion.hide();


     function beginQuiz(){
        // console.log("beginQuiz button clicked");
        // console.log("questions remaining: ", remainingQuestions)
       
        
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
      currentQuestion = questions[questionCount]
     }

     function nextQuestion(){

      if(questionCount + 1 != questions.length){
        $nextQuestion.hide();
        $flashMessage.html('');

          incrementQuestionCount();
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
      $question.html('quiz is over you got 4 out 6 correct answers! click below to restart')
      $answersArea.hide()
      $nextQuestion.hide();
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
